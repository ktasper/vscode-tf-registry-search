/*
Retrieves the selected text in the editor using the getSelectedTextAndPrevWord function.
    If there is no selected text, the function returns.
    The selected text is split into two parts: a prefix and a keyword.
    The keyword is encoded as a URI component using the encodeURI function.
    The query template is retrieved from the Visual Studio Code configuration using the get method.
    The query template is then modified by replacing the %SELECTION% placeholder with the encoded keyword and the %PREFIX% placeholder with the selected prefix.
    The modified query is opened in the default browser using the vscode.open command.

The getSelectedTextAndPrevWord function retrieves the selected text in the editor by performing the following steps:

    Retrieves the text of the active document.
    If there is no document text, it returns an empty string.
    Retrieves the active selection in the editor.
    If the selection is empty, it returns an empty string.
    Calculates the start and end offsets of the selection.∂
    Retrieves the selected text by slicing the document text.
    Trims the selected text and replaces multiple spaces with a single space.
    Also gets the previous word
*/



const CFG_SECTION = "tfSearch";
const CFG_QUERY = "QueryTemplate";
const CMD_ID = "extension.tfSearch";

const vscode = require("vscode");

function activate(context) {
  const disposable = vscode.commands.registerTextEditorCommand(
    CMD_ID,
    webSearch
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

function webSearch() {
  const selectedTextAndPrevWord = getSelectedTextAndPrevWord();
  if (!selectedTextAndPrevWord.selectedText) {
    return;
  }
  
  const selectedText = selectedTextAndPrevWord.selectedText;
  const selectedParts = selectedText.split("_");
  const selectedKeyword = selectedParts.slice(1).join("_");
  const selectedPrefix = selectedParts[0];
  let prevWord = selectedTextAndPrevWord.prevWord;
  
  if (prevWord === "resource") {
    prevWord = "resources";
  }
  if (prevWord === "data") {
    prevWord = "data-sources";
  }
  const tfSearchCfg = vscode.workspace.getConfiguration(CFG_SECTION);
  const queryTemplate = tfSearchCfg.get(CFG_QUERY);
  const query = queryTemplate
    .replace("%SELECTION%", selectedKeyword)
    .replace("%PREFIX%", selectedPrefix)
    .replace("%PREV_WORD%", prevWord);
  
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
}



function getSelectedTextAndPrevWord() {
  const documentText = vscode.window.activeTextEditor.document.getText();
  if (!documentText) {
    return "";
  }
  const activeSelection = vscode.window.activeTextEditor.selection;
  if (activeSelection.isEmpty) {
    return "";
  }
  const selStartoffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.start
  );
  const selEndOffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.end
  );

  let selectedText = documentText.slice(selStartoffset, selEndOffset).trim();
  selectedText = selectedText.replace(/\s\s+/g, " ");

  let prevWord = "";
  let match = /\b(data|resource)\b/.exec(documentText.slice(0, selStartoffset));
  if (match) {
    prevWord = match[1];
  }

  return {
    selectedText,
    prevWord
  };
}