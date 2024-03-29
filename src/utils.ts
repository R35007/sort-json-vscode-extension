import * as jsonc from "comment-json";
import json5 from "json5";
import * as _ from "lodash";
import { customAlphabet } from "nanoid";
import * as vscode from "vscode";
import { Settings } from "./Settings";
const nanoid = customAlphabet("1234567890abcdef", 5);

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

export const getJSONDetails = (originalData: string, hideError = false) => {
  let endDelimiter = "";
  let dataText = originalData;

  // remove , or ; at the end of the string and set it to the delimiter
  if (dataText.endsWith(";") || dataText.endsWith(",") || dataText.endsWith("\n")) {
    endDelimiter = dataText.endsWith(";") ? ";" : dataText.endsWith(",") ? "," : "\n";
    dataText = dataText.substring(0, dataText.length - 1);
  }

  const uniqueCode = "\\fu" + nanoid();
  // Escape all unicode sequence string. "\\u21D3" to "\\fu21D3"
  if (Settings.preserveUnicodeString) {
    dataText = dataText.replace(/\\u/gi, uniqueCode);
  }

  try {
    const data = JSON.parse(dataText) as object | any[];
    return { data, originalData, endDelimiter, stringify: JSON.stringify, uniqueCode };
  } catch (err) {
    try {
      // If parsing json with comment-json doesn't work the try with json5 parsing
      const data = jsonc.parse(dataText) as object | any[];
      return { data, endDelimiter, originalData, stringify: jsonc.stringify, uniqueCode };
    } catch (error: any) {
      try {
        const languageId = vscode.window.activeTextEditor?.document.languageId || "";
        // If parsing json with comment-json doesn't work the try with json5 parsing
        const data = json5.parse(dataText) as object | any[];
        const stringify = ["json", "jsonc", "jsonl"].includes(languageId) ? JSON.stringify : json5.stringify;
        return { data, endDelimiter, originalData, stringify, uniqueCode };
      } catch (error: any) {
        !hideError && vscode.window.showErrorMessage(`Invalid JSON. ${error.message}`);
        return;
      }
    }
  }
};

export const comparisonQuickPick = async (customComparisons: vscode.QuickPickItem[] = []) => {
  const disposables: vscode.Disposable[] = [];

  const copyComparisonCode = {
    iconPath: new vscode.ThemeIcon("pencil"),
    tooltip: "Edit selected comparison code",
  };

  const pick: vscode.QuickPickItem | undefined = await new Promise((resolve) => {
    let isResolved = false;
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = "Custom Comparison";
    quickPick.placeholder = "Please provide your own custom comparison code here.";
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
        if (!customComparisons.map((cc) => cc.label).includes(quickPick.value)) {
          const newItems = quickPick.value
            ? [{ label: quickPick.value, description: "custom comparison" }, ...customComparisons]
            : customComparisons;
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
      })
    );

    quickPick.show();
  });

  disposables.forEach((d) => d.dispose());

  return pick;
};

export const interpolateList = (
  a: any,
  b: any,
  {
    comparisonString = "a - b",
    isAllNumber = false,
    isAllString = false,
    isAllObject = false,
    isAllList = false,
    isCollection = false,
  } = {}
) => {
  const obj: any = {
    a,
    b,
    x: a,
    y: b,
    item1: a,
    item2: b,
    key1: a,
    key2: b,
    val1: a,
    val2: b,
    value1: a,
    value2: b,
    isArray: true,
    isList: true,
    isObject: false,
    isAllNumber,
    isAllString,
    isAllObject,
    isAllList,
    isCollection,
    _,
    lodash: _,
    dash: _,
  };
  return Function(...Object.keys(obj), `return ${comparisonString}`)(...Object.values(obj));
};

export const interpolateEntries = (
  [key1, val1]: any[] = [],
  [key2, val2]: any[] = [],
  {
    comparisonString = "key1.length - key2.length",
    isAllNumber = false,
    isAllString = false,
    isAllObject = false,
    isAllList = false,
    isCollection = false,
  } = {}
) => {
  const item1 = { key: key1, val: val1 };
  const item2 = { key: key2, val: val2 };
  const obj: any = {
    a: item1,
    b: item2,
    x: item1,
    y: item2,
    item1,
    item2,
    key1,
    key2,
    val1,
    val2,
    value1: val1,
    value2: val2,
    isArray: false,
    isList: false,
    isObject: true,
    isAllNumber,
    isAllString,
    isAllObject,
    isAllList,
    isCollection,
    _,
    lodash: _,
    dash: _,
  };
  return Function(...Object.keys(obj), `return ${comparisonString}`)(...Object.values(obj));
};

// This Copies the commented code to the sorted json object | any[] and returns the result
export const copySymbolsToObj = (src: object | any[], dest: object | any[]) => {
  const srcSymbols = Object.getOwnPropertySymbols(src);
  for (let srcSymbol of srcSymbols) {
    dest[srcSymbol] = src[srcSymbol];
  }
  return dest;
};

export const getValueTypes = (value: object | any[]) => {
  const isPlainObject = value && value !== null && !Array.isArray(value) && typeof value === 'object';
  const isAllNumber = isPlainObject ? Object.entries(value).map(([_key, val]) => parseInt(_.toString(val))).every(_.isInteger) : value.map((val) => parseInt(val)).every(_.isInteger);
  const isAllString = isPlainObject ? Object.entries(value).map(([_key, val]) => val).every(_.isString) : value.every(_.isString);
  const isAllObject = isPlainObject ? Object.entries(value).map(([_key, val]) => val).every(_.isPlainObject) : value.every(_.isPlainObject);
  const isAllList = isPlainObject ? Object.entries(value).map(([_key, val]) => val).every(_.isArray) : value.every(_.isArray);
  const isCollection = isAllObject;

  return {
    isAllNumber,
    isAllString,
    isAllObject,
    isAllList,
    isCollection,
  };
};

export const saveSortedJSON = (sortedJson: any, editorProps: ReturnType<typeof getEditorProps>, jsonDetails: ReturnType<typeof getJSONDetails>, isFixAllAction = false) => {
  if (!editorProps || !jsonDetails) return;

  const replaceRange = editorProps.selectedText ? editorProps.selection : editorProps.fullFile;

  editorProps.editor.edit((editBuilder) => {
    let sortedStr = jsonDetails.stringify(sortedJson, null, editorProps.editor.options.tabSize || "\t") + jsonDetails.endDelimiter;

    // Replace all uniqueCode with "\\u".
    if (Settings.preserveUnicodeString) {
      sortedStr = sortedStr.replace(new RegExp(`\\${jsonDetails.uniqueCode}`, "gi"), "\\u"); // replace unicode string
    }

    if (jsonDetails.originalData.replace(/\n/g, '').replace(/\s+/g, '') === sortedStr.replace(/\n/g, '').replace(/\s+/g, '')) {
      !isFixAllAction && Settings.showInfoMsg && vscode.window.showInformationMessage("Already Sorted.");
    } else {
      editBuilder.replace(replaceRange, sortedStr);
      !isFixAllAction && Settings.showInfoMsg && vscode.window.showInformationMessage("Sorted Successfully");
    }
  });
};

export const compareFileName = key => {
  const currentFilePath = vscode.window.activeTextEditor?.document.fileName.replace(/\\/g, "/") || "";
  try {
    return new RegExp(key).test(currentFilePath) || currentFilePath.includes(key);
  } catch (error) {
    return currentFilePath.includes(key);
  }
};
