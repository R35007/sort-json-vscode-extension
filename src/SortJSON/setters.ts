import * as _ from 'lodash';
import * as vscode from "vscode";
import { Settings } from '../Settings';
import { ListsSortTypes, ObjectsSortTypes } from '../enum';

// Set Sort Level
export const setSortLevel = async () => {
    const sortLevel = await vscode.window.showInputBox({
        title: "Sort Level",
        value: `${Settings.sortLevel}`,
        validateInput: (value) => {
            if (_.isNaN(parseInt(value))) return "Please provide a positive or negative number";
            if (parseInt(value) === 0) return "Please provide a non zero integer value";
        },
        placeHolder: "Please give a positive or negative integer value",
        prompt: "Set to -1 to do a full deep sort. Set to 1 to sort only at top level.",
    });

    if (!sortLevel || _.isNaN(parseInt(sortLevel))) return;

    Settings.sortLevel = parseInt(sortLevel);
    vscode.window.showInformationMessage(`Sort Level is set to : ${sortLevel}`);
};

// Set Default Custom Sort
export const setDefaultCustomSort = async () => {
    const defaultCustomSort = await vscode.window.showInputBox({
        title: "Default Custom Sort",
        value: Settings.defaultCustomSort || "",
        placeHolder: "Please give a custom sort comparison code",
        prompt: "Leave it empty to prompt each time on Do Custom Sort command",
    });

    Settings.defaultCustomSort = defaultCustomSort || "";
    vscode.window.showInformationMessage(`Default Custom Sort is set.`);
};

// Set Object Sort Type
export const setObjectSortType = async () => {
    const keyTypes = Object.values(ObjectsSortTypes);

    // make existing keyType to come at top of the list
    const existingItemIndex = keyTypes.indexOf(Settings.objectSortType);
    if (existingItemIndex > -1) {
        keyTypes.splice(existingItemIndex, 1);
    }

    const quickPickItems = [Settings.objectSortType, ...keyTypes].map((item) => ({ label: item }));

    const sortType = await vscode.window.showQuickPick(
        [{ label: "currently using", kind: vscode.QuickPickItemKind.Separator }, ...quickPickItems],
        {
            placeHolder: "Please select any Object Sort Type",
            title: "Object Sort Type",
        }
    );

    if (!sortType) return;

    Settings.objectSortType = sortType.label as ObjectsSortTypes;
    vscode.window.showInformationMessage(`Object Sort Type is set to : ${sortType.label}`);
};

// Set List Sort Type
export const setListSortType = async () => {
    const keyTypes = Object.values(ListsSortTypes);

    // make existing keyType to come at top of the list
    const existingItemIndex = keyTypes.indexOf(Settings.listSortType);
    if (existingItemIndex > -1) {
        keyTypes.splice(existingItemIndex, 1);
    }

    const quickPickItems = [Settings.listSortType, ...keyTypes].map((item) => ({ label: item }));

    const sortType = await vscode.window.showQuickPick(
        [{ label: "currently using", kind: vscode.QuickPickItemKind.Separator }, ...quickPickItems],
        {
            placeHolder: "Please select any List Sort Type",
            title: "List Sort Type",
        }
    );

    if (!sortType) return;

    Settings.listSortType = sortType.label as ListsSortTypes;
    vscode.window.showInformationMessage(`List Sort Type is set to : ${sortType.label}`);
};

export const setCaseSensitive = async (isCaseSensitive: boolean) => {
    Settings.isCaseSensitive = isCaseSensitive;
    vscode.window.showInformationMessage(`Sort is now : ${isCaseSensitive ? "Case-Sensitive" : "Case-InSensitive"}`);
};

export const setPromptCollectionKeys = async (promptCollectionKeys: boolean) => {
    Settings.promptCollectionKeys = promptCollectionKeys;
    vscode.window.showInformationMessage(promptCollectionKeys ? 'Prompt Collection Keys to sort' : "Don't Prompt Collection keys sort");
};
