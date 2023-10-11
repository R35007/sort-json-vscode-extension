import _ from 'lodash';
import * as vscode from "vscode";
import { Settings } from '../Settings';
import sampleComparisons, { ComparisonTypes } from "../sampleComparisons";
import { comparisonQuickPick } from '../utils';

// Get custom comparison string from quick pick command pallet
export const getCustomComparison = async (selectedItem?: vscode.QuickPickItem, isRandomizeSort = false) => {
    if (isRandomizeSort) return { label: sampleComparisons[ComparisonTypes.randomize], description: ComparisonTypes.randomize, value: sampleComparisons[ComparisonTypes.randomize] };
    if (Settings.defaultCustomSort?.length) return { label: Settings.defaultCustomSort, description: "Default custom sort" };

    const defaultComparisonItems = Object.entries(sampleComparisons).map(([description, comparison]) => ({ description, comparison }));
    const customComparisons = [...Settings.customSortComparisons, ...defaultComparisonItems];
    const quickPickItems = customComparisons.map((cc) => ({ label: cc.comparison, description: cc.description, value: cc.comparison }));

    let existingComparison: any = [];
    if (selectedItem) {
        const existingItemIndex = quickPickItems.findIndex((item) => item.label === selectedItem.label);
        if (existingItemIndex > -1) {
            quickPickItems.splice(existingItemIndex, 1);
        }

        existingComparison = [
            { label: "recently used", kind: vscode.QuickPickItemKind.Separator },
            { label: selectedItem.label, description: selectedItem.description },
        ];
    }

    return await comparisonQuickPick([...existingComparison, ...quickPickItems]);
};

// get list of keys to sort the list from multi select quick pick
export const getKeysToSort = async (data: object) => {
    const keys = (data as any[]).reduce((keys, item) => keys.concat(Object.keys(item)), []);
    const uniqueKeys = [...new Set(keys)] as string[];

    const quickPickItems: vscode.QuickPickItem[] = uniqueKeys.map(key => ({ label: key, picked: key === "id" }));

    const result = await vscode.window.showQuickPick(quickPickItems, {
        canPickMany: true,
        placeHolder: "Please select any key to sort",
    });

    return result;
};

// If list get length, if object get size else convert to string and get length
export const getLength = (val) => {
    if (_.isArray(val)) return val.length;
    if (_.isPlainObject(val)) return Object.keys(val).length;
    if (_.isInteger(parseInt(val))) return val;
    return _.toString(val).length;
};
