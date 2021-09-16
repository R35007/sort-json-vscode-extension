// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SORT_JSON, SORT_JSON_DEEP, SORT_JSON_DEEP_REVERSE, SORT_JSON_REVERSE } from './enum';
import { sortJSON } from './sortJSON';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Sort JSON
  context.subscriptions.push(vscode.commands.registerCommand(SORT_JSON, () => sortJSON(false, false)));
  // Sort JSON Deep
  context.subscriptions.push(vscode.commands.registerCommand(SORT_JSON_DEEP, () => sortJSON(true, false)));
  // Sort JSON Reverse
  context.subscriptions.push(vscode.commands.registerCommand(SORT_JSON_REVERSE, () => sortJSON(false, true)));
  // Sort JSON Deep Reverse
  context.subscriptions.push(vscode.commands.registerCommand(SORT_JSON_DEEP_REVERSE, () => sortJSON(true, true)));
}

// this method is called when your extension is deactivated
export function deactivate() {}
