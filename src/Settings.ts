import * as _ from 'lodash';
import * as path from 'path';
import * as vscode from 'vscode';
import { ListsSortTypes, ObjectsSortTypes, SortModes, ValueTypeOrder } from './enum';
import { compareFileName } from './utils';

export class Settings {
  static get configuration() {
    return vscode.workspace.getConfiguration('sort-json.settings');
  }
  static getSettings(val: string) {
    return Settings.configuration.get(val);
  }
  static setSettings(key: string, val: any, isGlobal = true) {
    return Settings.configuration.update(key, val, isGlobal);
  }

  static get sortMode() {
    return Settings.getSettings('sortMode') as SortModes || SortModes.both;
  }

  static get sortLevel() {
    return Settings.getSettings('sortLevel') as number || -1;
  }
  static set sortLevel(level: number) {
    Settings.setSettings('sortLevel', level);
  }

  static get objectSortType() {
    return Settings.getSettings('objectSortType') as ObjectsSortTypes || ObjectsSortTypes.key;
  }
  static set objectSortType(value: ObjectsSortTypes) {
    Settings.setSettings('objectSortType', value);
  }

  static get listSortType() {
    return Settings.getSettings('listSortType') as ListsSortTypes || ListsSortTypes.value;
  }
  static set listSortType(value: ListsSortTypes) {
    Settings.setSettings('listSortType', value);
  }

  static get sortValueTypeOrder() {
    const valueTypeOrder = Settings.getSettings('sortValueTypeOrder') as ValueTypeOrder[];
    return [...valueTypeOrder, ...Object.values(ValueTypeOrder).filter(item => !valueTypeOrder.includes(item))] as ValueTypeOrder[];
  }

  static get isCaseSensitive() {
    return Settings.getSettings('isCaseSensitive') as boolean;
  }
  static set isCaseSensitive(value: boolean) {
    Settings.setSettings('isCaseSensitive', value);
  }

  static get promptCollectionKeys() {
    return Settings.getSettings('promptCollectionKeys') as boolean;
  }
  static set promptCollectionKeys(value: boolean) {
    Settings.setSettings('promptCollectionKeys', value);
  }

  static get preserveUnicodeString() {
    return Settings.getSettings('preserveUnicodeString') as string;
  }

  static get orderOverrideKeys(): string[] {
    try {
      const currentFilePath = vscode.window.activeTextEditor?.document.fileName.replace(/\\/g, "/") || " * ";
      const currentFileName = path.basename(currentFilePath);
      const orderOverrideKeys = Settings.getSettings('orderOverrideKeys') || [];

      if (_.isPlainObject(orderOverrideKeys)) {
        if (orderOverrideKeys[currentFileName]) return orderOverrideKeys[currentFileName];
        const matchedKey = Object.keys(orderOverrideKeys).find(compareFileName) ?? "*";
        return orderOverrideKeys[matchedKey] || [];
      }

      return orderOverrideKeys as string[] || [];
    } catch (err) {
      return [];
    }
  }
  static get excludePaths() {
    return (Settings.getSettings('excludePaths') as string[]) || [];
  }
  static get customSortComparisons() {
    return (Settings.getSettings('customSortComparisons')) as Array<{ description: string, comparison: string }>;
  }

  static get defaultCustomSort() {
    return (Settings.getSettings('defaultCustomSort')) as string;
  }
  static set defaultCustomSort(value: string) {
    Settings.setSettings('defaultCustomSort', value);
  }

  static get contextMenu() {
    return (Settings.getSettings('contextMenu') as object) || {};
  }

  static get showInfoMsg() {
    return Settings.getSettings('showInfoMsg') as boolean;
  }

  static get ignoreFiles() {
    return Settings.getSettings('ignoreFiles') as string[] || [];
  }

  static get insertFinalNewline() {
    return vscode.workspace.getConfiguration().get("files.insertFinalNewline") as boolean;
  }

  static get forceSort() {
    return Settings.getSettings('forceSort') as boolean;
  }

  static get jsonFormatIndent() {
    return Settings.getSettings('jsonFormatIndent') as number | null;
  }
}
