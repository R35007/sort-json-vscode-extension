import * as vscode from 'vscode';

export const getEditorProps = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
    const editorText = document.getText(textRange);
    const selectedText = document.getText(selection);
    return { editor, document, selection, textRange, editorText, selectedText };
  }

  return;
};

export const writeFile = (
  editor: vscode.TextEditor,
  replaceRange: vscode.Range | vscode.Selection,
  data: object = {}
) => {
  editor.edit((editBuilder) => {
    editBuilder.replace(replaceRange, JSON.stringify(data, null, editor.options.tabSize));
    vscode.window.showInformationMessage('Sorted Successfully');
  });
};

export const getSortKeys = async (data: Array<object>) => {
  const keysList = data.reduce((res: string[], d) => [...res, ...Object.keys(d)], []) as string[];
  const uniqueKeysList = [...new Set(keysList)];
  return vscode.window.showQuickPick(uniqueKeysList, {
    canPickMany: true,
    placeHolder: 'Please select any key to sort',
  });
};

export const getCustomComparison = async (customComparisons: vscode.QuickPickItem[] = []) => {
  return new Promise((resolve) => {
    let isResolved = false;
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = "Custom Comparison";
    quickPick.placeholder = 'Please provide your own custom comparison code here.';
    quickPick.matchOnDescription = true;
    quickPick.canSelectMany = false;
    quickPick.items = customComparisons;
    quickPick.onDidAccept(() => {
      const selection = quickPick.activeItems[0];
      if (!isResolved) {
        resolve(selection);
        isResolved = true;
      }
      quickPick.dispose();
    });
    quickPick.onDidChangeValue(() => {
      // add a new custom comparison to the pick list as the first item
      if (!customComparisons.map(cc => cc.label).includes(quickPick.value)) {
        const newItems = quickPick.value ? [{ label: quickPick.value, value: quickPick.value, description: "custom comparison" }, ...customComparisons] : customComparisons;
        quickPick.items = newItems;
      }
    });
    quickPick.onDidHide(() => {
      if (!isResolved) {
        resolve(undefined);
        isResolved = true;
      }
      quickPick.dispose();
    });
    quickPick.show();
  });
};
