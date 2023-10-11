import * as vscode from "vscode";

export class SortJSONFixAllProvider implements vscode.CodeActionProvider {
    static fixAllCodeActionKind = vscode.CodeActionKind.SourceFixAll.append("sort-json");

    static metadata = { providedCodeActionKinds: [SortJSONFixAllProvider.fixAllCodeActionKind] };

    async provideCodeActions(document, _range, context, _token) {
        if (!context.only) return [];

        if (
            !context.only.contains(SortJSONFixAllProvider.fixAllCodeActionKind) &&
            !SortJSONFixAllProvider.fixAllCodeActionKind.contains(context.only)
        ) {
            return [];
        }

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
