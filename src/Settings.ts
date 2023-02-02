import * as vscode from 'vscode';
import { ListsSortTypes, ObjectsSortTypes, SortModes, ValueTypeOrder } from './enum';

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
    return Settings.getSettings('sortValueTypeOrder') as ValueTypeOrder[];
  }

  static get isCaseSensitive() {
    return Settings.getSettings('isCaseSensitive') as boolean;
  }
  static set isCaseSensitive(value: boolean) {
    Settings.setSettings('isCaseSensitive', value);
  }

  static get preserveUnicodeString() {
    return Settings.getSettings('preserveUnicodeString') as string;
  }

  static get orderOverrideKeys() {
    return (Settings.getSettings('orderOverrideKeys') as string[] | { [key: string]: string[] }) || [];
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
}
