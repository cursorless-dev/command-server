import * as vscode from "vscode";

export function getTmpdDirSetting(): string | undefined {
  const value = vscode.workspace
    .getConfiguration("command-server")
    .get<string>("tmpDir")
    ?.trim();
  return value ? value : undefined;
}

export function onTmpDirSettingChange(callback: () => void) {
  vscode.workspace.onDidChangeConfiguration(async (e) => {
    if (e.affectsConfiguration("command-server.tmpDir")) {
      callback();
    }
  });
}
