import * as vscode from 'vscode';

export type SortType = 'Key' | 'Key Length' | 'Value' | 'Value Length' | 'Value Type';
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
  static get contextMenu() {
    return (Settings.getSettings('contextMenu') as object) || {};
  }
  static get orderOverride() {
    return (Settings.getSettings('orderOverride') as string[]) || [];
  }
  static get isCaseSensitive() {
    return Settings.getSettings('isCaseSensitive') as boolean;
  }
  static set isCaseSensitive(value: boolean) {
    Settings.setSettings('isCaseSensitive', value);
  }
  static get sortType() {
    return Settings.getSettings('sortType') as SortType;
  }
  static set sortType(value: SortType) {
    Settings.setSettings('sortType', value);
  }
  static get sortValueTypeOrder() {
    return (
      (Settings.getSettings('sortValueTypeOrder') as string[]) || [
        'boolean',
        'null',
        'number',
        'string',
        'array',
        'object',
      ]
    );
  }
}
