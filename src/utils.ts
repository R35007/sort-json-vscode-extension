import * as jsonc from "comment-json";
import json5 from "json5";
import * as _ from "lodash";
import { customAlphabet } from "nanoid";
import * as vscode from "vscode";
import { Settings } from "./Settings";
import { ValueTypeOrder } from './enum';
const nanoid = customAlphabet("1234567890abcdef", 5);

export const getEditorProps = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) return;

  const document = editor.document;
  const selection = editor.selection;
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const fullFile = new vscode.Range(firstLine.range.start, lastLine.range.end);
  const editorText = document.getText(fullFile);
  const selectedText = document.getText(selection);
  const hasSelectedText = selectedText?.trim().length > 0;
  return { editor, document, selection, fullFile, editorText, selectedText, hasSelectedText };
};

const parseJSON = (dataText: string) => {
  try {
    const data = JSON.parse(dataText);
    return { data, stringify: JSON.stringify };
  } catch (err) {
    try {
      // If parsing json with comment-json doesn't work the try with json5 parsing
      const data = jsonc.parse(dataText);
      return { data, stringify: jsonc.stringify };
    } catch {
      const languageId = vscode.window.activeTextEditor?.document.languageId || "";
      // If parsing json with comment-json doesn't work the try with json5 parsing
      const data = json5.parse(dataText);
      const stringify = ["json", "jsonc", "jsonl"].includes(languageId) ? JSON.stringify : json5.stringify;
      return { data, stringify };
    }
  }
}

const checkBrackets = (text) => (text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))

export const getJSONDetails = (originalData = "", hideError = false, hasSelection = false) => {
  let endDelimiter = [";", ",", "\n"].includes(originalData.trim().slice(-1)) ? originalData.trim().slice(-1) : "";
  let dataText = endDelimiter ? originalData.trim().slice(0, -1) : originalData.trim();

  if (!hasSelection && Settings.insertFinalNewline && endDelimiter !== "\n") {
    endDelimiter = "\n";
  }

  const uniqueCode = "\\fu" + nanoid();
  // Escape all unicode sequence string. "\\u21D3" to "\\fu21D3"
  if (Settings.preserveUnicodeString) {
    dataText = dataText.replace(/\\u/gi, uniqueCode);
  }

  if (checkBrackets(dataText.trim())) {
    try {
      const { data, stringify } = parseJSON(dataText);
      return { data, endDelimiter, originalData, stringify, uniqueCode, wrappedBrackets: "" };
    } catch (error: any) {
      !hideError && vscode.window.showErrorMessage(`Invalid JSON. ${error.message}`);
      return { data: "", endDelimiter, originalData, stringify: JSON.stringify, uniqueCode, wrappedBrackets: "" };
    }
  } else if (hasSelection) {
    try {
      const { data, stringify } = parseJSON(`{${dataText}}`);
      return { data, endDelimiter, originalData, stringify, uniqueCode, wrappedBrackets: "{}" };
    } catch {
      try {
        const { data, stringify } = parseJSON(`[${dataText}]`);
        return { data, endDelimiter, originalData, stringify, uniqueCode, wrappedBrackets: "[]" };
      } catch (error: any) {
        !hideError && vscode.window.showErrorMessage(`Invalid JSON. ${error.message}`);
        return { data: "", endDelimiter, originalData, stringify: JSON.stringify, uniqueCode, wrappedBrackets: "" };
      }
    }
  };

  return { data: "", endDelimiter, originalData, stringify: JSON.stringify, uniqueCode, wrappedBrackets: "" };
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
    quickPick.ignoreFocusOut = true;
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
  const indent = Settings.jsonFormatIndent ?? (editorProps.editor.options.tabSize || "\t");

  editorProps.editor.edit((editBuilder) => {
    let sortedStr = jsonDetails.stringify(sortedJson, null, indent);
    sortedStr = jsonDetails.wrappedBrackets ? sortedStr.slice(1, -1).trim() : sortedStr.trim();
    sortedStr = sortedStr + jsonDetails.endDelimiter

    // Replace all uniqueCode with "\\u".
    if (Settings.preserveUnicodeString) {
      sortedStr = sortedStr.trim().replace(new RegExp(`\\${jsonDetails.uniqueCode}`, "gi"), "\\u").trim(); // replace unicode string
    }

    if (!Settings.forceSort && jsonDetails.originalData.replace(/\n/g, '').replace(/\s+/g, '') === sortedStr.replace(/\n/g, '').replace(/\s+/g, '')) {
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

export const isValueType = (value: unknown, valueType: ValueTypeOrder) => {
  if (valueType === ValueTypeOrder.boolean) return _.isBoolean(value)
  if (valueType === ValueTypeOrder.null) return _.isNull(value)
  if (valueType === ValueTypeOrder.number) return _.isNumber(value)
  if (valueType === ValueTypeOrder.string) return _.isString(value)
  if (valueType === ValueTypeOrder.array) return _.isArray(value) && !value.every(_.isPlainObject)
  if (valueType === ValueTypeOrder.collection) return _.isArray(value) && value.every(_.isPlainObject)
  if (valueType === ValueTypeOrder.plainObject) return _.isPlainObject(value)
  return true;
}
