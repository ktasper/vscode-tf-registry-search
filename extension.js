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
   // Get the selected text and the word preceding it
  const selectedTextAndPrevWord = getSelectedTextAndPrevWord();
  if (!selectedTextAndPrevWord.selectedText) {
    return;
  }

   // Get the selected text and split it into parts
  const selectedText = selectedTextAndPrevWord.selectedText;
  const selectedParts = selectedText.split("_");
  // Get the keyword for the search by combining all parts except the first one
  const selectedKeyword = selectedParts.slice(1).join("_");
  // The first part is considered the "selected prefix", IE: AWS, Google
  const selectedPrefix = selectedParts[0];
  // Check if we are using a data or resource type
  let prevWord = selectedTextAndPrevWord.prevWord;
  // Change the search word so it works in the browser
  if (prevWord === "resource") {
    prevWord = "resources";
  }
  if (prevWord === "data") {
    prevWord = "data-sources";
  }
  // VScode stuff
  const tfSearchCfg = vscode.workspace.getConfiguration(CFG_SECTION);
  const queryTemplate = tfSearchCfg.get(CFG_QUERY);
  const query = queryTemplate
    .replace("%SELECTION%", selectedKeyword)
    .replace("%PREFIX%", selectedPrefix)
    .replace("%PREV_WORD%", prevWord);

  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
}

function getSelectedTextAndPrevWord() {
  // Get the text of the current document in the active text editor
  const documentText = vscode.window.activeTextEditor.document.getText();
  if (!documentText) {
    return "";
  }
  // Get the current active selection in the text editor
  const activeSelection = vscode.window.activeTextEditor.selection;
  if (activeSelection.isEmpty) {
    return "";
  }
  // Get the starting offset and ending offset of the selected text
  const selStartoffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.start
  );
  const selEndOffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.end
  );

  // Get the selected text, trimming leading and trailing whitespaces, and replace multiple spaces with a single space
  let selectedText = documentText.slice(selStartoffset, selEndOffset).trim();
  selectedText = selectedText.replace(/\s\s+/g, " ");

  // Get the text of selected line
  let prevLine = vscode.window.activeTextEditor.document.lineAt(
    activeSelection.start.line
  ).text;
  // Get the first word of the same line
  let prevWord = prevLine.split(" ")[0];

  return {
    selectedText,
    prevWord,
  };
}
