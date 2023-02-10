/*
This code is a Visual Studio Code extension that performs a web search using a specified template and the selected text in the editor.

The code starts by defining several string constants, which are used later in the code:

    CFG_SECTION: A string that specifies the configuration section to be used for storing the web search query template.
    CFG_QUERY: A string that specifies the key for the query template stored in the configuration.
    CMD_ID: A string that specifies the identifier for the command that launches the web search.

It then imports the vscode module, which is the API for Visual Studio Code extensions.

The activate function is called when the extension is activated and it registers the webSearch function as a command in Visual Studio Code using the registerTextEditorCommand method.

The deactivate function is an empty function that is called when the extension is deactivated.

The webSearch function performs the web search by performing the following steps:

    Retrieves the selected text in the editor using the getSelectedText function.
    If there is no selected text, the function returns.
    The selected text is split into two parts: a prefix and a keyword.
    The keyword is encoded as a URI component using the encodeURI function.
    The query template is retrieved from the Visual Studio Code configuration using the get method.
    The query template is then modified by replacing the %SELECTION% placeholder with the encoded keyword and the %PREFIX% placeholder with the selected prefix.
    The modified query is opened in the default browser using the vscode.open command.

The getSelectedText function retrieves the selected text in the editor by performing the following steps:

    Retrieves the text of the active document.
    If there is no document text, it returns an empty string.
    Retrieves the active selection in the editor.
    If the selection is empty, it returns an empty string.
    Calculates the start and end offsets of the selection.
    Retrieves the selected text by slicing the document text.
    Trims the selected text and replaces multiple spaces with a single space.
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
  const selectedText = getSelectedText();
  if (!selectedText) {
    return;
  }
  
  const selectedParts = selectedText.split("_");
  const selectedKeyword = selectedParts.slice(1).join("_");
  const selectedPrefix = selectedParts[0];
  const uriText = encodeURI(selectedKeyword);
  
  const tfSearchCfg = vscode.workspace.getConfiguration(CFG_SECTION);
  const queryTemplate = tfSearchCfg.get(CFG_QUERY);
  const query = queryTemplate
    .replace("%SELECTION%", uriText)
    .replace("%PREFIX%", selectedPrefix);
  
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
}


function getSelectedText() {
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
  return selectedText.replace(/\s\s+/g, " ");
}