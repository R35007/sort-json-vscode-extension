import * as vscode from "vscode";
import { Settings } from '../../Settings';
import { compareFileName } from '../../utils';

export class SortJSONFixAllProvider implements vscode.CodeActionProvider {
    static fixAllCodeActionKind = vscode.CodeActionKind.SourceFixAll.append("sort-json");

    static metadata = { providedCodeActionKinds: [SortJSONFixAllProvider.fixAllCodeActionKind] };

    async provideCodeActions(_document, _range, context, _token) {
        if (!context.only) return [];

        if (
            !context.only.contains(SortJSONFixAllProvider.fixAllCodeActionKind) &&
            !SortJSONFixAllProvider.fixAllCodeActionKind.contains(context.only)
        ) {
            return [];
        }

        const filesToIgnore = Settings.ignoreFiles;
        const shouldIgnoreFix = filesToIgnore.some(compareFileName);

        if (shouldIgnoreFix) return [];


        const isFixAllAction = true; // If false it shows the collection key prompt and info notification.
        const fixAllAction = await vscode.commands.executeCommand("sort-json.ascendingSort", undefined, isFixAllAction);

        if (!fixAllAction) return [];

        return [
            {
                ...fixAllAction,
                title: "Fix All sortJSON",
                kind: SortJSONFixAllProvider.fixAllCodeActionKind
            }
        ];
    }
}
