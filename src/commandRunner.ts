import type { RequestCallbackOptions } from "talon-rpc";
import * as vscode from "vscode";
import { globsToRegex } from "./regex";

export class CommandRunner {
  private allowRegex!: RegExp;
  private denyRegex!: RegExp | null;
  private backgroundWindowProtection!: boolean;

  public constructor() {
    this.reloadConfiguration = this.reloadConfiguration.bind(this);
    this.runCommand = this.runCommand.bind(this);

    this.reloadConfiguration();
    vscode.workspace.onDidChangeConfiguration(() => this.reloadConfiguration());
  }

  private reloadConfiguration(): void {
    const allowList = vscode.workspace
      .getConfiguration("command-server")
      .get<string[]>("allowList", []);

    this.allowRegex = globsToRegex(allowList);

    const denyList = vscode.workspace
      .getConfiguration("command-server")
      .get<string[]>("denyList", []);

    this.denyRegex = denyList.length === 0 ? null : globsToRegex(denyList);

    this.backgroundWindowProtection = vscode.workspace
      .getConfiguration("command-server")
      .get<boolean>("backgroundWindowProtection", false);
  }

  public runCommand(
    commandId: string,
    args: unknown[],
    options: RequestCallbackOptions,
  ): unknown {
    if (!vscode.window.state.focused) {
      if (this.backgroundWindowProtection) {
        throw new Error("This editor is not active");
      } else {
        options.warn("This editor is not active");
      }
    }

    if (!this.allowRegex.test(commandId)) {
      throw new Error("Command not in allowList");
    }

    if (this.denyRegex != null && commandId.match(this.denyRegex)) {
      throw new Error("Command in denyList");
    }

    return vscode.commands.executeCommand(commandId, ...args);
  }
}
