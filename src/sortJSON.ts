import * as JPH from 'json-parse-helpfulerror';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import { Settings } from './Settings';
import { getEditorProps, getSortKeys, writeFile } from './utils';

export const sortJSON = async (isDeep: boolean = false, isReverse: boolean = false) => {
  try {
    const editorProps = getEditorProps();
    if (!editorProps) return;

    const data = JPH.parse(editorProps.selectedText || editorProps.editorText);

    const sortedData = await sort(data, isDeep, isReverse);

    const replaceRange = editorProps.selectedText ? editorProps.selection : editorProps.textRange;

    writeFile(editorProps.editor, replaceRange, sortedData);
  } catch (err: any) {
    vscode.window.showErrorMessage(`Invalid JSON : ${err.message}`);
  }
};

// Sort
const sort = async <T>(
  data: T,
  isDeep: boolean = false,
  isReverse: boolean = false,
  level: number = 0
): Promise<T | object> => {
  if (_.isArray(data)) {
    return await sortArray(data, isDeep, isReverse, level);
  } else if (_.isPlainObject(data)) {
    return await sortObject(data, isDeep, isReverse, level);
  }
  return data;
};

// Sort any Array type
const sortArray = async (
  data: any[],
  isDeep: boolean = false,
  isReverse: boolean = false,
  level: number = 0
): Promise<any[]> => {
  let result: any[];
  const isCollection = data.every((d) => _.isPlainObject(d));
  const sortKeys = isCollection && !level ? (await getSortKeys(data)) || [] : [];

  result = isCollection ? (sortKeys.length ? _.sortBy(data, sortKeys) : data) : data.sort(compare);
  result = isDeep
    ? await Promise.all(result.map(async (item) => await sort(item, isDeep, isReverse, level + 1)))
    : result;
  result = isReverse ? result.reverse() : result;

  return result;
};

// Sort Object
const sortObject = async (
  data: any,
  isDeep: boolean = false,
  isReverse: boolean = false,
  level: number = 0
): Promise<object> => {
  let result: any = {};
  const sortOrderKeys: string[] = Settings.orderOverride || [];

  const objectKeys = [...new Set([...sortOrderKeys, ...Object.keys(data).sort(compare)])];
  const sortKeys = isReverse ? objectKeys.reverse() : objectKeys;

  for await (let key of sortKeys) {
    result[key] = isDeep ? await sort(data[key], isDeep, isReverse, level + 1) : data[key];
  }

  return result;
};

// Legacy Sort Comparision
const compare = (a: any, b: any) => {
  let x = a;
  let y = b;

  if (!Settings.isCaseSensitive) {
    x = _.isString(a) ? a.toUpperCase() : a;
    y = _.isString(b) ? b.toUpperCase() : b;
  }

  return x == y ? 0 : x > y ? 1 : -1;
};
