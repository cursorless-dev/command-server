import * as vscode from "vscode";

export function getCommunicationParentDirSetting(): string | undefined {
  const value = vscode.workspace
    .getConfiguration("command-server")
    .get<string>("communicationParentDirectory")
    ?.trim();
  return value ? value : undefined;
}

export function onCommunicationParentDirSettingChange(callback: () => void) {
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("command-server.communicationParentDirectory")) {
      callback();
    }
  });
}
