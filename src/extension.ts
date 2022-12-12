// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from './enum';
import { Settings } from './Settings';
import SortJSON from './sortJSON';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  const sortJSON = new SortJSON();

  // Sort Ascending
  context.subscriptions.push(vscode.commands.registerCommand(Commands.ascendingSort, () => sortJSON.sort()));
  // Sort Descending
  context.subscriptions.push(vscode.commands.registerCommand(Commands.descendingSort, () => sortJSON.sort(true)));
  // Set Default Custom Sort
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setDefaultCustomSort, () => sortJSON.setDefaultCustomSort()));
  // Do Custom Sort
  context.subscriptions.push(vscode.commands.registerCommand(Commands.customSort, () => sortJSON.sort(false, true)));
  // Set Sort Level
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setSortLevel, () => sortJSON.setSortLevel()));
  // Set Object Sort Type
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setObjectSortType, () => sortJSON.setObjectSortType()));
  // Set List Sort Type
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setListSortType, () => sortJSON.setListSortType()));
  // Toggle sort case sensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.toggleCaseSensitive, () => sortJSON.setCaseSensitive(!Settings.isCaseSensitive)));
  // Set sort case sensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setCaseSensitive, () => sortJSON.setCaseSensitive(true)));
  // Set sort case insensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setCaseInSensitive, () => sortJSON.setCaseSensitive(false)));
}

// this method is called when your extension is deactivated
export function deactivate() { }
