// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Settings } from './Settings';
import SortJSON from './SortJSON';
import { SortJSONFixAllProvider } from './SortJSON/CodeActions/FixAllProvider';
import { SortJSONQuickFixProvider } from './SortJSON/CodeActions/QuickFixProvider';
import { setCaseSensitive, setDefaultCustomSort, setListSortType, setObjectSortType, setPromptCollectionKeys, setSortLevel } from './SortJSON/setters';
import { Commands } from './enum';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  const sortJSON = new SortJSON();

  // Sort Ascending
  context.subscriptions.push(vscode.commands.registerCommand(Commands.ascendingSort, (_, isFixAllAction) => sortJSON.sort({ isFixAllAction })));
  // Sort Descending
  context.subscriptions.push(vscode.commands.registerCommand(Commands.descendingSort, (_, isFixAllAction) => sortJSON.sort({ isDescending: true, isFixAllAction })));
  // Sort Randomize
  context.subscriptions.push(vscode.commands.registerCommand(Commands.randomizeSort, () => sortJSON.sort({ isCustomSort: true, isRandomizeSort: true })));
  // Do Custom Sort
  context.subscriptions.push(vscode.commands.registerCommand(Commands.customSort, () => sortJSON.sort({ isCustomSort: true })));
  // Set Default Custom Sort
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setDefaultCustomSort, () => setDefaultCustomSort()));
  // Set Sort Level
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setSortLevel, () => setSortLevel()));
  // Set Object Sort Type
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setObjectSortType, () => setObjectSortType()));
  // Set List Sort Type
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setListSortType, () => setListSortType()));

  // Toggle sort case sensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.toggleCaseSensitive, () => setCaseSensitive(!Settings.isCaseSensitive)));
  // Set sort case sensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setCaseSensitive, () => setCaseSensitive(true)));
  // Set sort case insensitive
  context.subscriptions.push(vscode.commands.registerCommand(Commands.setCaseInSensitive, () => setCaseSensitive(false)));

  // Toggle Prompt Collection Keys
  context.subscriptions.push(vscode.commands.registerCommand(Commands.togglePromptCollectionKeys, () => setPromptCollectionKeys(!Settings.promptCollectionKeys)));
  // Prompt Collection Keys
  context.subscriptions.push(vscode.commands.registerCommand(Commands.promptCollectionKeys, () => setPromptCollectionKeys(true)));
  // Do not prompt collection keys
  context.subscriptions.push(vscode.commands.registerCommand(Commands.doNotPromptCollectionKeys, () => setPromptCollectionKeys(false)));

  // fix all source action
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider({ language: "json" }, new SortJSONFixAllProvider(), SortJSONFixAllProvider.metadata));
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider({ language: "jsonc" }, new SortJSONFixAllProvider(), SortJSONFixAllProvider.metadata));

  // quick fix action
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider("*", new SortJSONQuickFixProvider(), SortJSONQuickFixProvider.metadata));
}

// this method is called when your extension is deactivated
export function deactivate() { }
