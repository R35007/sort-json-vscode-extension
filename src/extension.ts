// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from './enum';
import { Settings } from './Settings';
import { setCaseSensitive, setSortType, sortJSON, sortJSONByCustomComparison } from './sortJSON';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Sort JSON
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SORT_JSON, () => sortJSON(false, false)));
  // Sort JSON Deep
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SORT_JSON_DEEP, () => sortJSON(true, false)));
  // Sort JSON Reverse
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SORT_JSON_REVERSE, () => sortJSON(false, true)));
  // Sort JSON Deep Reverse
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SORT_JSON_DEEP_REVERSE, () => sortJSON(true, true)));
  // Sort JSON By Custom Comparison
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SORT_JSON_BY_CUSTOM_COMPARISON, sortJSONByCustomComparison));
  
  // Set Sort Type
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SET_SORT_TYPE, () => setSortType()));
  // Toggle sort case sensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.TOGGLE_CASE_SENSITIVE, () => setCaseSensitive(!Settings.isCaseSensitive)));
  // Set sort case sensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SET_CASE_SENSITIVE, () => setCaseSensitive(true)));
  // Set sort case insensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.SET_CASE_INSENSITIVE, () => setCaseSensitive(false)));
}

// this method is called when your extension is deactivated
export function deactivate() { }
