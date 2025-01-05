import * as vscode from "vscode";
import * as path from "path";

export function getUserDataPath(context: vscode.ExtensionContext): string {
  const userPath = path.resolve(context.globalStorageUri.fsPath, "../..");

  if (path.basename(userPath) !== "User") {
    throw new Error("Could not find userData path");
  }

  return userPath;
}
