import { Minimatch } from "minimatch";
import type { RequestCallbackOptions } from "talon-rpc";
import * as vscode from "vscode";
import { any } from "./regex";

export default class CommandRunner {
  private allowRegex!: RegExp;
  private denyRegex!: RegExp | null;
  private backgroundWindowProtection!: boolean;

  constructor() {
    this.reloadConfiguration = this.reloadConfiguration.bind(this);
    this.runCommand = this.runCommand.bind(this);

    this.reloadConfiguration();
    vscode.workspace.onDidChangeConfiguration(this.reloadConfiguration);
  }

  private reloadConfiguration() {
    const allowList = vscode.workspace
      .getConfiguration("command-server")
      .get<string[]>("allowList")!;

    this.allowRegex = any(
      ...allowList.map((glob) => new Minimatch(glob).makeRe())
    );

    const denyList = vscode.workspace
      .getConfiguration("command-server")
      .get<string[]>("denyList")!;

    this.denyRegex =
      denyList.length === 0
        ? null
        : any(...denyList.map((glob) => new Minimatch(glob).makeRe()));

    this.backgroundWindowProtection = vscode.workspace
      .getConfiguration("command-server")
      .get<boolean>("backgroundWindowProtection")!;
  }

  runCommand(commandId: string, args: any[], options: RequestCallbackOptions) {
    if (!vscode.window.state.focused) {
      if (this.backgroundWindowProtection) {
        throw new Error("This editor is not active");
      } else {
        options.warn("This editor is not active");
      }
    }

    if (!commandId.match(this.allowRegex)) {
      throw new Error("Command not in allowList");
    }

    if (this.denyRegex != null && commandId.match(this.denyRegex)) {
      throw new Error("Command in denyList");
    }

    return vscode.commands.executeCommand(commandId, ...args);
  }
}
