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
    editBuilder.replace(replaceRange, JSON.stringify(data, null, 2));
    vscode.window.showInformationMessage('Sorted Successfully');
  });
};

export const getSortKeys = async (data: Array<object>) => {
  const keysList = data.reduce((res: string[], d) => [...res, ...Object.keys(d)], []) as string[];
  const uniquekeysList = [...new Set(keysList)];
  return vscode.window.showQuickPick(uniquekeysList, {
    canPickMany: true,
    placeHolder: 'Please select any key to sort',
  });
};
