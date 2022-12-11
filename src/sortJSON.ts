import * as _ from 'lodash';
import * as vscode from 'vscode';
import { ListsSortTypes, ObjectsSortTypes, SortModes } from './enum';
import { Settings } from './Settings';
import { customListComparison, customObjectComparison, getCustomComparison, getData, getEditorProps, getKeysToSort, writeFile } from './utils';

export default class SortJSON {

  isDescending = false;
  isCustomSort = false;
  customComparison;
  keysToSort: string[] = [];

  // Set Sort Level
  async setSortLevel() {
    const sortLevel = await vscode.window.showInputBox({
      title: "Sort Level",
      value: `${Settings.sortLevel}`,
      validateInput: (value) => {
        if (_.isNaN(parseInt(value))) return "Please provide a positive or negative number";
        if (parseInt(value) === 0) return "Please provide a non zero integer value";
      },
      placeHolder: "Please give a positive or negative integer value",
      prompt: "Set to -1 to do a full deep sort. Set to 1 to sort only at top level."
    });

    if (!sortLevel || _.isNaN(parseInt(sortLevel))) return;

    Settings.sortLevel = parseInt(sortLevel);
    vscode.window.showInformationMessage(`Sort Level is set to : ${sortLevel}`);
  }

  // Set Object Sort Type
  async setObjectSortType() {
    const keyTypes = Object.values(ObjectsSortTypes);

    // make existing keyType to come at top of the list
    const existingItemIndex = keyTypes.indexOf(Settings.objectSortType);
    if (existingItemIndex > -1) { keyTypes.splice(existingItemIndex, 1); }

    const quickPickItems = [Settings.objectSortType, ...keyTypes].map(item => ({ label: item }));

    const sortType = (await vscode.window.showQuickPick([{ label: "currently using", kind: vscode.QuickPickItemKind.Separator }, ...quickPickItems], {
      placeHolder: 'Please select any Object Sort Type',
      title: "Object Sort Type"
    }));

    if (!sortType) return;

    Settings.objectSortType = sortType.label as ObjectsSortTypes;
    vscode.window.showInformationMessage(`Object Sort Type is set to : ${sortType}`);
  };

  // Set List Sort Type
  async setListSortType() {
    const keyTypes = Object.values(ListsSortTypes);

    // make existing keyType to come at top of the list
    const existingItemIndex = keyTypes.indexOf(Settings.listSortType);
    if (existingItemIndex > -1) { keyTypes.splice(existingItemIndex, 1); }

    const quickPickItems = [Settings.listSortType, ...keyTypes].map(item => ({ label: item }));

    const sortType = (await vscode.window.showQuickPick([{ label: "currently using", kind: vscode.QuickPickItemKind.Separator }, ...quickPickItems], {
      placeHolder: 'Please select any List Sort Type',
      title: "List Sort Type"
    }));

    if (!sortType) return;

    Settings.listSortType = sortType.label as ListsSortTypes;
    vscode.window.showInformationMessage(`List Sort Type is set to : ${sortType}`);
  };

  async setCaseSensitive(isCaseSensitive: boolean) {
    Settings.isCaseSensitive = isCaseSensitive;
    vscode.window.showInformationMessage(`Sort is now : ${isCaseSensitive ? 'Case-Sensitive' : 'Case-InSensitive'}`);
  };

  async sort(isDescending = false, isCustomSort = false) {
    try {
      const editorProps = getEditorProps();

      const { data, endDelimiter } = getData(editorProps);

      if (!editorProps || !data) return; // return if no data to sort

      this.isDescending = isDescending;
      this.isCustomSort = isCustomSort;

      // Get custom comparison string.
      if (this.isCustomSort) {
        const customComparison = await getCustomComparison(this.customComparison);
        if (!customComparison) return; // return if no custom comparison is selected
        this.customComparison = customComparison; // set custom comparison only if custom comparison is selected
      }

      // Get keys to sort if data is a collection
      const isCollection = _.isArray(data) && data.every(_.isPlainObject); // Check is every item in an array is a object
      if (!this.isCustomSort && isCollection) {
        const keys = (data as any[]).reduce((keys, item) => keys.concat(Object.keys(item)), []);
        const keysToSort = await getKeysToSort([...new Set(keys)] as string[]);
        if (!keysToSort || !keysToSort.length) return;
        this.keysToSort = keysToSort;
      }

      const sortedJson = this.#getSortedJson(data, Settings.sortLevel, "");

      const replaceRange = editorProps.selectedText ? editorProps.selection : editorProps.fullFile;
      writeFile(editorProps.editor, replaceRange, sortedJson, endDelimiter);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Unable to Sort. ${err.message}`);
    }
  };

  // recursive method to get sorted json
  #getSortedJson(data: any[] | object, level: number, path: string) {

    if (Settings.excludePaths.includes(path)) return data; // return if current path is excluded in settings
    if (level === 0) return data; // return if current level reaches 0

    if (_.isArray(data)) return this.#sortArray(data, level, path);
    if (_.isPlainObject(data)) return this.#sortObject(data, level, path);
    return data;
  };

  // Sort Array
  #sortArray(
    data: any[],
    level: number,
    path: string
  ) {
    let result = data;

    // sort each item in an array ( sort children )
    result = result.map((item, index) => this.#getSortedJson(item, level - 1, `${path}[${index}]`));

    // Don't sort list when we need to sort only object 
    if (Settings.sortMode === SortModes.objectsOnly) return result;
    if (this.isCustomSort) return this.#getCustomSortedItems(result); // Do custom sort

    result = this.#getSortedValues(result, Settings.listSortType);
    result = this.isDescending ? result.reverse() : result; // Sort descending
    return result;
  };

  // Sort Object
  #sortObject(
    data: object,
    level: number,
    path: string
  ) {
    const orderedKeys = this.#getOrderedKeys(data);
    const overriddenKeys = [...new Set([...Settings.orderOverrideKeys, ...orderedKeys])]; //  Get Unique Keys
    const sortedKeys = this.isDescending ? overriddenKeys.reverse() : overriddenKeys; // Sort keys descending

    const result = sortedKeys.reduce((res, key) => ({ ...res, [key]: this.#getSortedJson(data[key], level - 1, path ? `${path}.${key}` : key) }), {});

    return result;
  };

  // Order Object Keys
  #getOrderedKeys(data: object): string[] {
    if (Settings.sortMode === SortModes.listsOnly) return Object.keys(data);
    if (this.isCustomSort) {
      const sortedEntries = this.#getCustomSortedItems(Object.entries(data), true); // Do custom sort
      return sortedEntries.map(([key]) => key);
    }
    return this.#getSortedKeys(Object.entries(data), Settings.objectSortType);
  };

  #getCustomSortedItems(arr: any[], isEntries: boolean = false): any[] {
    const isAllNumber = isEntries ? arr.map(([_key, val]) => parseInt(val)).every(_.isInteger) : arr.map(val => parseInt(val)).every(_.isInteger);
    const isAllString = isEntries ? arr.map(([_key, val]) => val).every(_.isString) : arr.every(_.isString);
    const isAllObject = isEntries ? arr.map(([_key, val]) => val).every(_.isPlainObject) : arr.every(_.isPlainObject);
    const isAllList = isEntries ? arr.map(([_key, val]) => val).every(_.isArray) : arr.every(_.isArray);
    const isCollection = isAllObject;

    const options = { isAllNumber, isAllString, isAllObject, isAllList, isCollection, comparisonString: this.customComparison?.label };

    return arr.sort((a, b) => isEntries ? customObjectComparison(a, b, options) : customListComparison(a, b, options));
  };

  // Get Sorted Values
  #getSortedValues(arr: any[], sortType: ListsSortTypes): any[] {
    if (sortType === ListsSortTypes.value) {
      const isAllNumber = arr.map(val => parseInt(val)).every(_.isInteger);
      const isAllString = arr.every(_.isString);
      const isCollection = arr.every(_.isPlainObject);
      const isAllList = arr.every(_.isArray);

      if (isAllNumber) return arr.sort((a, b) => a - b);
      if (isAllString && Settings.isCaseSensitive) return arr.sort((a, b) => a === b ? 0 : a > b ? 1 : -1);
      if (isAllString && !Settings.isCaseSensitive) return arr.sort((a, b) => _.toLower(a) === _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1);
      if (isAllList) return arr.sort((a, b) => a.length - b.length);
      if (isCollection) return this.keysToSort.length ? _.sortBy(arr, this.keysToSort) : _.sortBy(arr, ["id"]);

      return arr.sort();
    }

    if (sortType === ListsSortTypes.valueLength) {
      // If list get length, if object get size else convert to string and get length
      const getLength = (val) => {
        if (_.isArray(val)) return val.length;
        if (_.isPlainObject(val)) return val.size;
        if (_.isInteger(parseInt(val))) return val;
        return _.toString(val).length;
      };

      return arr.sort((a, b) => {
        const x = getLength(a);
        const y = getLength(b);
        return x - y;
      });
    }

    if (sortType === ListsSortTypes.valueType) {
      const typeReducer: any = (res: string[], valueType: string) => {
        const filteredValues = arr.filter((val) => _[`${'is' + valueType}`](val));
        return res.concat(this.#getSortedValues(filteredValues, ListsSortTypes.value));
      };

      return Settings.sortValueTypeOrder.reduce(typeReducer, []);
    }

    return arr.sort();
  }

  // Get Sorted Keys from entries
  #getSortedKeys(arr: Array<[string, any]>, sortType: ObjectsSortTypes): string[] {
    if (sortType === ObjectsSortTypes.key) {
      return arr.map(([key]) => key).sort((a, b) => {
        if (Settings.isCaseSensitive) return a === b ? 0 : a > b ? 1 : -1;
        return _.toLower(a) === _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1;
      });
    }

    if (sortType === ObjectsSortTypes.keyLength) {
      return arr.map(([key]) => key).sort((a, b) => {
        const x = a.length;
        const y = b.length;
        return x - y;
      });
    }

    if (sortType === ObjectsSortTypes.value) {
      const isAllNumber = arr.map(([_key, val]) => parseInt(val)).every(_.isInteger);
      const isAllString = arr.map(([_key, val]) => val).every(_.isString);
      const isAllObject = arr.map(([_key, val]) => val).every(_.isPlainObject);
      const isAllList = arr.map(([_key, val]) => val).every(_.isArray);

      if (isAllNumber) return arr.sort(([_key1, val1], [_key2, val2]) => val1 - val2).map(([key]) => key);
      if (isAllString && Settings.isCaseSensitive) return arr.sort(([_key1, val1], [_key2, val2]) => val1 === val2 ? 0 : val1 > val2 ? 1 : -1).map(([key]) => key);
      if (isAllString && !Settings.isCaseSensitive) return arr.sort(([_key1, val1], [_key2, val2]) => _.toLower(val1) === _.toLower(val2) ? 0 : _.toLower(val1) > _.toLower(val2) ? 1 : -1).map(([key]) => key);
      if (isAllList) return arr.sort(([_key1, val1], [_key2, val2]) => val1.length - val2.length).map(([key]) => key);
      if (isAllObject) return arr.sort(([_key1, val1], [_key2, val2]) => val1.size - val2.size).map(([key]) => key);

      return arr.map(([key]) => key).sort();
    }


    if (sortType === ObjectsSortTypes.valueLength) {
      // If list get length, if object get size else convert to string and get length
      const getLength = (val) => {
        if (_.isArray(val)) return val.length;
        if (_.isPlainObject(val)) return val.size;
        if (_.isInteger(parseInt(val))) return val;
        return _.toString(val).length;
      };

      return arr.sort((a, b) => {
        const x = getLength(a[1]);
        const y = getLength(b[1]);
        return x - y;
      }).map(([key]) => key);
    }

    if (sortType === ObjectsSortTypes.valueType) {
      const typeReducer: any = (res: string[], valueType: string) => {
        const filteredValues = arr.filter(([_key, val]) => _[`is${valueType}`](val));
        return res.concat(this.#getSortedKeys(filteredValues, ObjectsSortTypes.value));
      };

      return Settings.sortValueTypeOrder.reduce(typeReducer, []);
    }

    return arr.map(([key]) => key).sort();
  }
}
