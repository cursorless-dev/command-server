import * as vscode from "vscode";

export function getCommunicationDirLocationSetting(): string | undefined {
  const value = vscode.workspace
    .getConfiguration("command-server")
    .get<string>("communicationDirLocation")
    ?.trim();
  return value != null && value !== "" ? value : undefined;
}

export function onCommunicationDirLocationSettingChange(
  callback: () => void,
): void {
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("command-server.communicationDirLocation")) {
      callback();
    }
  });
}
