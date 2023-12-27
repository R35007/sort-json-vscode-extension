import * as vscode from "vscode";
import { Commands } from '../../enum';
import { getEditorProps, getJSONDetails } from '../../utils';

export class SortJSONQuickFixProvider implements vscode.CodeActionProvider {
    static quickFixCodeActionKind = vscode.CodeActionKind.QuickFix;

    static metadata = { providedCodeActionKinds: [SortJSONQuickFixProvider.quickFixCodeActionKind] };

    async provideCodeActions(_document, _range, _context, _token) {
        const editorProps = getEditorProps();
        if (!editorProps) return; // exit if there is no active editor

        const selectedText = editorProps.selectedText.trim();
        if (!selectedText) return; // exit if there is no text is selected

        const jsonDetails = getJSONDetails(selectedText, true);
        if (!jsonDetails || !jsonDetails.data) return; // exit if selected text is not a valid json

        return [
            this.sortAscending(),
            this.sortDescending(),
        ];
    }

    private sortAscending(): vscode.CodeAction {
        const fix = new vscode.CodeAction(`Sort Ascending`, vscode.CodeActionKind.Empty);
        fix.command = { command: Commands.ascendingSort, title: 'Sort Ascending', tooltip: 'Sort in ascending order.' };
        return fix;
    }
    private sortDescending(): vscode.CodeAction {
        const fix = new vscode.CodeAction(`Sort Descending`, vscode.CodeActionKind.Empty);
        fix.command = { command: Commands.descendingSort, title: 'Sort Descending', tooltip: 'Sort in descending order.' };
        return fix;
    }
}
