import * as JPH from 'json-parse-helpfulerror';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import { Settings, SortType } from './Settings';
import { getCustomComparison, getEditorProps, getSortKeys, writeFile } from './utils';
import DefaultCustomComparisons from "./defaultCustomComparisons";

export const sortJSONByCustomComparison = async () => {
  try {
    const editorProps = getEditorProps();
    if (!editorProps) return;

    const defaultComparisonItems = Object.entries(DefaultCustomComparisons).map(([sortType, comparisonCode]) => ({
      description: sortType,
      comparison: comparisonCode
    }));
    const customComparisons = [...Settings.customComparisons, ...defaultComparisonItems];
    const quickPickItems = customComparisons.map(cc => ({ label: cc.comparison, description: cc.description, value: cc.comparison }));
    const customComparisonObj: any = await getCustomComparison(quickPickItems);

    if (!customComparisonObj) return;

    const data = JPH.parse(editorProps.selectedText || editorProps.editorText);
    const sortedData = await getSortedDataByCustomComparison(data, customComparisonObj.value);

    const replaceRange = editorProps.selectedText ? editorProps.selection : editorProps.textRange;
    writeFile(editorProps.editor, replaceRange, sortedData);
  } catch (err: any) {
    vscode.window.showErrorMessage(`Unable to Sort. ${err.message}`);
  }
};

export const sortJSON = async (isDeep: boolean = false, isReverse: boolean = false) => {
  try {
    const editorProps = getEditorProps();
    if (!editorProps) return;

    const data = JPH.parse(editorProps.selectedText || editorProps.editorText);
    const sortedData = await getSortedData(data, isDeep, isReverse);

    const replaceRange = editorProps.selectedText ? editorProps.selection : editorProps.textRange;
    writeFile(editorProps.editor, replaceRange, sortedData);
  } catch (err: any) {
    vscode.window.showErrorMessage(`Unable to Sort. ${err.message}`);
  }
};

const getSortedDataByCustomComparison = <T extends object>(data: T, comparison: string): T => {
  if (_.isArray(data)) {
    return data.sort((a, b) => {
      const obj: any = { a, b, item1: a, item2: b, key1: a, key2: b, val1: a, val2: b, x: a, y: b };
      return Function(...Object.keys(obj), `return ${comparison}`)(...Object.values(obj));
    });
  } else if (_.isPlainObject(data)) {
    const sortedEntries = Object.entries(data as object).sort(([key1, val1], [key2, val2]) => {
      const item1 = { key: key1, val: val1 };
      const item2 = { key: key2, val: val2 };
      const obj: any = {
        key1, val1, key2, val2, item1, item2,
        a: item1, b: item2, x: item1, y: item2
      };
      return Function(...Object.keys(obj), `return ${comparison}`)(...Object.values(obj));
    });
    return _.fromPairs(sortedEntries) as T;
  }
  return data;
};

// Sort
const getSortedData = async <T>(
  data: T,
  isDeep: boolean = false,
  isReverse: boolean = false,
  level: number = 0,
  path: string = ""
): Promise<T | object> => {

  if (Settings.excludePaths.includes(path)) return data;
  if (level === Settings.deepSortLevel) return data;

  if (_.isArray(data)) {
    return await sortArray(data, isDeep, isReverse, level, path);
  } else if (_.isPlainObject(data)) {
    return await sortObject(data, isDeep, isReverse, level, path);
  }
  return data;
};

// Sort any Array type
const sortArray = async (
  data: any[],
  isDeep: boolean = false,
  isReverse: boolean = false,
  level: number = 0,
  path: string = ""
): Promise<any[]> => {
  let result: any[];


  const isCollection = data.every((d) => _.isPlainObject(d));
  const sortKeys = isCollection && !level ? (await getSortKeys(data)) || [] : [];

  result = level && Settings.ignoreArraysOnDeepSort ? data : isCollection ? (sortKeys.length ? _.sortBy(data, sortKeys) : data) : data.sort(compareString);
  result = isDeep
    ? await Promise.all(result.map(async (item, index) => await getSortedData(item, isDeep, isReverse, level + 1, `${path}[${index}]`)))
    : result;
  result = isReverse ? result.reverse() : result;

  return result;
};

// Sort Object
const sortObject = async (
  data: any,
  isDeep: boolean = false,
  isReverse: boolean = false,
  level: number = 0,
  path: string = ""
): Promise<object> => {
  let result: any = {};

  if (level && isDeep && Settings.ignoreObjectsOnDeepSort) {
    for await (let key of Object.keys(data)) {
      result[key] = isDeep ? await getSortedData(data[key], isDeep, isReverse, level + 1, path ? `${path}.${key}` : key) : data[key];
    }
  } else {
    const sortKeysOrder = getSortKeysOrder(data, isReverse);
    for await (let key of sortKeysOrder) {
      result[key] = isDeep ? await getSortedData(data[key], isDeep, isReverse, level + 1, path ? `${path}.${key}` : key) : data[key];
    }
  }

  return result;
};

const getSortKeysOrder = (data: any, isReverse: boolean) => {
  const orderOverrideKeys: string[] = Settings.orderOverride || [];

  let sortedObjectKeys: string[] = [];
  let objectKeys: string[] = [];

  switch (Settings.sortType) {
    case 'Value': {
      sortedObjectKeys = Object.keys(data).sort((a, b) => compareString(data[a], data[b]));
      break;
    }
    case 'Value Length': {
      sortedObjectKeys = Object.keys(data).sort((a, b) => compareLength(data[a], data[b]));
      break;
    }
    case 'Value Type': {
      const typeReducer: any = (res: string[], type: string) => {
        const filteredKeys = Object.keys(data).filter((key) => eval(`_.${'is' + type}`)(data[key]));
        return res.concat(filteredKeys.sort((a, b) => compareString(data[a], data[b])));
      };

      sortedObjectKeys = Settings.sortValueTypeOrder.reduce(typeReducer, []);
      break;
    }
    case 'Key Length': {
      sortedObjectKeys = Object.keys(data).sort((a, b) => compareLength(a, b));
      break;
    }
    default: {
      // Sort By Object Keys
      sortedObjectKeys = Object.keys(data).sort(compareString);
      break;
    }
  }

  objectKeys = [...new Set([...orderOverrideKeys, ...sortedObjectKeys])]; //  Get Unique Keys
  const sortKeysOrder = isReverse ? objectKeys.reverse() : objectKeys;
  return sortKeysOrder;
};

// Sort By Value Length Comparison
const compareLength = (a: any, b: any) => {
  const aLength = _.isArray(a) ? a.length : _.isPlainObject(a) ? Object.keys(a).length : JSON.stringify(a).length;
  const bLength = _.isArray(b) ? b.length : _.isPlainObject(b) ? Object.keys(b).length : JSON.stringify(b).length;

  return aLength - bLength;
};

// Sort Comparison
const compareString = (a: any, b: any) => {
  let x = _.isString(a) ? a : JSON.stringify(a);
  let y = _.isString(b) ? b : JSON.stringify(b);

  if (!Settings.isCaseSensitive) {
    x = _.isString(x) ? x.toUpperCase() : x;
    y = _.isString(y) ? y.toUpperCase() : y;
  }

  // eslint-disable-next-line eqeqeq
  return x == y ? 0 : x > y ? 1 : -1;
};

// Set Sort Type
export const setSortType = async () => {
  const keyTypes = ['Key', 'Key Length', 'Value', 'Value Length', 'Value Type'];

  // make existing keyType to come at top of the list
  const index = keyTypes.indexOf(Settings.sortType);
  if (index > -1) { keyTypes.splice(index, 1); }

  const sortType = (await vscode.window.showQuickPick([Settings.sortType, ...keyTypes], {
    placeHolder: 'Please select any Sort Type',
  }));

  if (!sortType) return;

  Settings.sortType = sortType as SortType;
  vscode.window.showInformationMessage(`Sort Type is set to : ${sortType}`);
};

export const setCaseSensitive = (isCaseSensitive: boolean) => {
  Settings.isCaseSensitive = isCaseSensitive;
  vscode.window.showInformationMessage(`Sort is now : ${isCaseSensitive ? 'Case-Sensitive' : 'Case-InSensitive'}`);
};
