import * as _ from "lodash";
import * as path from "path";
import * as vscode from "vscode";
import { Settings } from "../Settings";
import { ListsSortTypes, ObjectsSortTypes, SortModes, ValueTypeOrder } from "../enum";
import {
  copySymbolsToObj, getEditorProps, getJSONDetails, getValueTypes, interpolateEntries, interpolateList, isValueType, saveSortedJSON
} from "../utils";
import { getCustomComparison, getKeysToSort, getLength } from './getters';

type SortOptions = {
  isDescending?: boolean;
  isCustomSort?: boolean;
  isRandomizeSort?: boolean;
  promptCollectionKeys?: boolean
  isFixAllAction?: boolean
};

export default class SortJSON {
  isDescending = false;
  isCustomSort = false;
  customComparison;
  keysToSort: string[] = ["id"];
  fileName: string = "";

  // Get Sorted Values
  #getSortedValues(arr: any[], sortType: ListsSortTypes): any[] {
    if (sortType === ListsSortTypes.value) {
      const { isAllNumber, isAllString, isAllList, isCollection } = getValueTypes(arr);

      if (isAllNumber) return arr.sort((a, b) => a - b);
      if (isAllString && Settings.isCaseSensitive) return arr.sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
      if (isAllString && !Settings.isCaseSensitive) return arr.sort((a, b) => (_.toLower(a) === _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1));
      if (isAllList) return arr.sort((a, b) => a?.length - b?.length);
      if (isCollection) return this.keysToSort?.length ? _.sortBy(arr, this.keysToSort) : arr;

      return arr.sort();
    }

    if (sortType === ListsSortTypes.valueLength) return arr.sort((a, b) => getLength(a) - getLength(b));

    if (sortType === ListsSortTypes.valueType) {
      const typeReducer: any = (res: string[], valueType: ValueTypeOrder) => {
        const filteredValues = arr.filter((val) => isValueType(val, valueType));
        return [...res, ...this.#getSortedValues(filteredValues, ListsSortTypes.value)];
      };

      return Settings.sortValueTypeOrder.reduce(typeReducer, []);
    }

    return arr.sort();
  }

  // Get Sorted Keys from entries
  #getSortedEntries(entries: Array<[string, any]>, sortType: ObjectsSortTypes): Array<[string, any]> {

    if (sortType === ObjectsSortTypes.key && Settings.isCaseSensitive) return entries.sort(([a], [b]) => a === b ? 0 : a > b ? 1 : -1);
    if (sortType === ObjectsSortTypes.key && !Settings.isCaseSensitive) return entries.sort(([a], [b]) => _.toLower(a) === _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1);
    if (sortType === ObjectsSortTypes.keyLength) return entries.sort(([a], [b]) => a?.length - b?.length);

    if (sortType === ObjectsSortTypes.value) {

      const { isAllNumber, isAllString, isAllObject, isAllList } = getValueTypes(entries);

      if (isAllNumber) return entries.sort(([, val1], [, val2]) => val1 - val2);
      if (isAllString && Settings.isCaseSensitive) return entries.sort(([, val1], [, val2]) => (val1 === val2 ? 0 : val1 > val2 ? 1 : -1));
      if (isAllString && !Settings.isCaseSensitive) return entries.sort(([, val1], [, val2]) => (_.toLower(val1) === _.toLower(val2) ? 0 : _.toLower(val1) > _.toLower(val2) ? 1 : -1));
      if (isAllList) return entries.sort(([, val1], [, val2]) => val1?.length - val2?.length);
      if (isAllObject) return entries.sort(([, val1], [, val2]) => Object.keys(val1)?.length - Object.keys(val2)?.length);

      return entries.sort(([a], [b]) => a === b ? 0 : a > b ? 1 : -1);
    }

    if (sortType === ObjectsSortTypes.valueLength) return entries.sort(([a], [b]) => getLength(a) - getLength(b));

    if (sortType === ObjectsSortTypes.valueType) {
      const typeReducer: any = (res: string[], valueType: ValueTypeOrder) => {
        const filteredValues = entries.filter(([, val]) => isValueType(val, valueType));
        return [...res, ...this.#getSortedEntries(filteredValues, ObjectsSortTypes.value)];
      };

      return Settings.sortValueTypeOrder.reduce(typeReducer, []);
    }

    return entries.sort(([a], [b]) => a === b ? 0 : a > b ? 1 : -1);
  }


  #getOverriddenKeys(keys: any[]) {

    const orderOverrideKeys = Settings.orderOverrideKeys;
    const keysWithoutOverriddenKeys: string[] = keys.filter((key) => !orderOverrideKeys.includes(key));

    // Replace remaining keys in place of (...) in orderOverrideKeys
    const spreadIndex = orderOverrideKeys.indexOf("...");
    if (spreadIndex > -1) orderOverrideKeys.splice(spreadIndex, 1, ...keysWithoutOverriddenKeys);
    else orderOverrideKeys.push(...keysWithoutOverriddenKeys);


    const overriddenKeys = [...new Set(orderOverrideKeys)].filter(key => keys.includes(key)); //  Get Unique Keys
    const sortedOverriddenKeysKeys = this.isDescending ? overriddenKeys.reverse() : overriddenKeys; // Sort keys descending

    return sortedOverriddenKeysKeys;
  }

  // Sort Object
  #sortObject(data: object, level: number, path: string) {
    let result = data;

    // Depth First Sort
    // sort each value in an object ( sort children before top level sort)
    result = Object.fromEntries(Object.entries(result).map(([key]) => {
      // set key in square brackets if it contains any special characters.
      // ex : "foobar" -> path.foobar, "foo_bar" -> path.foo_bar, "foo-bar" -> path["foo-bar"], "foo bar" -> path["foo bar"]
      const nestedPath = /\W/.test(key) ? `${path}.${key}` : `${path}["${key}"]`;
      return [key, this.#getSortedJson(data[key], level - 1, path ? nestedPath : key)];
    }));

    // Don't sort list when we need to sort only list
    if (Settings.sortMode === SortModes.listsOnly) return copySymbolsToObj(data, result);

    // Do custom sort
    if (this.isCustomSort) {
      const options = { ...getValueTypes(result), comparisonString: this.customComparison?.label };
      result = Object.fromEntries(Object.entries(result).sort((a, b) => interpolateEntries(a, b, options)));
      return copySymbolsToObj(data, result);
    }

    // get the ordered keys 
    let sortedKeys = this.#getSortedEntries(Object.entries(data), Settings.objectSortType).map(([key]) => key);

    // get order overridden Keys
    sortedKeys = this.#getOverriddenKeys(sortedKeys);

    // sort the top level object
    result = sortedKeys.reduce((res, key) => ({ ...res, [key]: result[key] }), {});

    return copySymbolsToObj(data, result);
  }

  // Sort Array
  #sortArray(data: any[], level: number, path: string) {
    let result = data;

    // Depth First Sort
    // sort each item in an array ( sort children before top level sort)
    result = result.map((item, index) => this.#getSortedJson(item, level - 1, `${path}[${index}]`));

    // Don't sort list when we need to sort only object
    if (Settings.sortMode === SortModes.objectsOnly) return copySymbolsToObj(data, result);

    // Do custom sort
    if (this.isCustomSort) {
      const options = { ...getValueTypes(result), comparisonString: this.customComparison?.label };
      result = result.sort((a, b) => interpolateList(a, b, options));
      return copySymbolsToObj(data, result);
    }

    // sort the top level list
    result = this.#getSortedValues(result, Settings.listSortType);

    // Sort descending
    result = this.isDescending ? result.reverse() : result;

    return copySymbolsToObj(data, result);
  }

  // recursive method to get sorted json
  #getSortedJson(data: any[] | object, level: number, path: string) {
    if (Settings.excludePaths.includes(path)) return data; // return if current path is excluded in settings
    if (level === 0) return data; // return if current level reaches 0

    if (_.isArray(data)) return this.#sortArray(data, level, path);
    if (_.isPlainObject(data)) return this.#sortObject(data, level, path);
    return data;
  }


  async sort({
    isDescending = false,
    isCustomSort = false,
    isRandomizeSort = false,
    isFixAllAction = false,
  }: SortOptions) {
    try {
      const editorProps = getEditorProps();
      if (!editorProps) return; // exit if there is no active editor

      const jsonText = editorProps.selectedText.trim() || editorProps.editorText;
      if (!jsonText) return; // exit if there is no text in editor

      const jsonDetails = getJSONDetails(jsonText, false, editorProps.hasSelectedText) || { data: undefined };
      const data = jsonDetails.data;
      if (!data) return; // return if no data to sort

      this.isDescending = isDescending;
      this.isCustomSort = isCustomSort || isRandomizeSort;
      this.fileName = path.basename(editorProps.document.fileName);

      // Get custom comparison string.
      if (isCustomSort || isRandomizeSort) {
        this.customComparison = await getCustomComparison(this.customComparison, isRandomizeSort);
        if (!this.customComparison) return; // exit if no custom comparison is selected
      }

      // Get keys to sort if data is a collection
      const isCollection = _.isArray(data) && data.every(_.isPlainObject); // Check is every item in an array is a object
      if (Settings.promptCollectionKeys && !isFixAllAction && !this.isCustomSort && Settings.listSortType !== ListsSortTypes.valueLength && isCollection) {
        const picked = await getKeysToSort(data);
        if (!picked) return; // exit if escaped
        this.keysToSort = picked.map(item => item.label);
      }

      // Get sorted JSON
      const sortedJson = this.#getSortedJson(data, Settings.sortLevel, "");

      // save the sorted json in editor
      saveSortedJSON(sortedJson, editorProps, jsonDetails, isFixAllAction);

    } catch (err: any) {
      !isFixAllAction && vscode.window.showErrorMessage(`Unable to Sort. ${err.message}`);
    }
  }
}
