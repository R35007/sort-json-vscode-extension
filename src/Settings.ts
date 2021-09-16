import * as vscode from 'vscode';

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
}
