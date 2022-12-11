import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as JPH from 'json-parse-helpfulerror';
import sampleComparisons from "./sampleComparisons";
import { Settings } from './Settings';

export const getEditorProps = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const fullFile = new vscode.Range(firstLine.range.start, lastLine.range.end);
    const editorText = document.getText(fullFile);
    const selectedText = document.getText(selection);
    return { editor, document, selection, fullFile, editorText, selectedText };
  }

  return;
};

export const getData = (editorProps: ReturnType<typeof getEditorProps>) => {
  if (!editorProps) return {};

  try {
    let endDelimiter = "";
    let dataText = editorProps.selectedText || editorProps.editorText;
    if (dataText.endsWith(";") || dataText.endsWith(",")) {
      endDelimiter = dataText.endsWith(";") ? ";" : ",";
      dataText = dataText.substring(0, dataText.length - 1);
    };
    const data = JPH.parse(dataText);
    return { data, endDelimiter };
  } catch (error: any) {
    vscode.window.showErrorMessage(`Invalid JSON. ${error.message}`);
    return {};
  }
};


export const writeFile = (
  editor: vscode.TextEditor,
  replaceRange: vscode.Range | vscode.Selection,
  data: object = {},
  endDelimiter: string = ''
) => {
  editor.edit((editBuilder) => {
    editBuilder.replace(replaceRange, JSON.stringify(data, null, editor.options.tabSize) + endDelimiter);
    vscode.window.showInformationMessage('Sorted Successfully');
  });
};

export const getKeysToSort = async (keys: string[]) => {
  if (!keys.length) return [];

  const result = await vscode.window.showQuickPick(keys, {
    canPickMany: true,
    placeHolder: 'Please select any key to sort',
  });

  return result || [];
};

export const getCustomComparison = async (selectedItem?: vscode.QuickPickItem) => {
  const defaultComparisonItems = Object.entries(sampleComparisons).map(([description, comparison]) => ({ description, comparison }));
  const customComparisons = [...Settings.customSortComparisons, ...defaultComparisonItems];
  const quickPickItems = customComparisons.map(cc => ({ label: cc.comparison, description: cc.description, value: cc.comparison }));

  let existingComparison: any = [];
  if (selectedItem) {

    const existingItemIndex = quickPickItems.findIndex(item => item.label === selectedItem.label);
    if (existingItemIndex > -1) { quickPickItems.splice(existingItemIndex, 1); }

    existingComparison = [
      { label: "recently used", kind: vscode.QuickPickItemKind.Separator },
      { label: selectedItem.label, description: selectedItem.description }
    ];
  }

  return await comparisonQuickPick([...existingComparison, ...quickPickItems]);
};

export const comparisonQuickPick = async (customComparisons: vscode.QuickPickItem[] = []) => {
  const disposables: vscode.Disposable[] = [];

  const copyComparisonCode = {
    iconPath: new vscode.ThemeIcon("pencil"),
    tooltip: "Edit selected comparison code"
  };

  const pick: vscode.QuickPickItem | undefined = await new Promise((resolve) => {
    let isResolved = false;
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = "Custom Comparison";
    quickPick.placeholder = 'Please provide your own custom comparison code here.';
    quickPick.matchOnDescription = false;
    quickPick.canSelectMany = false;
    quickPick.items = customComparisons;
    quickPick.matchOnDetail = false;
    quickPick.buttons = [copyComparisonCode];

    disposables.push(
      quickPick.onDidAccept(() => {
        const selection = quickPick.activeItems[0];
        if (!isResolved) {
          resolve(selection);
          isResolved = true;
        }
        quickPick.dispose();
      }),
      quickPick.onDidChangeActive(() => {
        quickPick.title = quickPick.activeItems[0].description;
      }),
      quickPick.onDidChangeValue(() => {
        // add a new custom comparison to the pick list as the first item
        if (!customComparisons.map(cc => cc.label).includes(quickPick.value)) {
          const newItems = quickPick.value ? [{ label: quickPick.value, description: "custom comparison" }, ...customComparisons] : customComparisons;
          quickPick.items = newItems;
        }
      }),
      quickPick.onDidHide(() => {
        if (!isResolved) {
          resolve(undefined);
          isResolved = true;
        }
        quickPick.dispose();
      }),
      quickPick.onDidTriggerButton((_item) => {
        quickPick.value = quickPick.activeItems[0].label;
      }),
    );

    quickPick.show();
  });

  disposables.forEach(d => d.dispose());

  return pick;
};

export const customListComparison = (a: any, b: any, {
  comparisonString = "a - b",
  isAllNumber = false,
  isAllString = false,
  isAllObject = false,
  isAllList = false,
  isCollection = false,
} = {}) => {
  const obj: any = {
    a, b,
    x: a, y: b,
    item1: a, item2: b,
    key1: a, key2: b,
    val1: a, val2: b, value1: a, value2: b,
    isArray: true, isList: true, isObject: false,
    isAllNumber, isAllString, isAllObject, isAllList, isCollection,
    _, lodash: _, dash: _,
  };
  return Function(...Object.keys(obj), `return ${comparisonString}`)(...Object.values(obj));
};

export const customObjectComparison = ([key1, val1]: [string, any], [key2, val2]: [string, any], {
  comparisonString = "key1.length - key2.length",
  isAllNumber = false,
  isAllString = false,
  isAllObject = false,
  isAllList = false,
  isCollection = false,
} = {}) => {
  const item1 = { key: key1, val: val1 };
  const item2 = { key: key2, val: val2 };
  const obj: any = {
    a: item1, b: item2,
    x: item1, y: item2,
    item1, item2,
    key1, key2,
    val1, val2,
    value1: val1, value2: val2,
    isArray: false, isList: false, isObject: true,
    isAllNumber, isAllString, isAllObject, isAllList, isCollection,
    _, lodash: _, dash: _,
  };
  return Function(...Object.keys(obj), `return ${comparisonString}`)(...Object.values(obj));
};
