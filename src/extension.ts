import { NodeIo, TalonRpcServer } from "talon-rpc";
import * as vscode from "vscode";
import { CommandRunner } from "./commandRunner";
import {
  getCommunicationDirLocationSetting,
  onCommunicationDirLocationSettingChange,
} from "./communicationDirLocationSetting";
import type { FocusedElementType, ReturnApi } from "./types";

export const RPC_DIR_NAME = "vscode-command-server";

export async function activate(
  context: vscode.ExtensionContext,
): Promise<ReturnApi> {
  const commandRunner = new CommandRunner();
  let io = new NodeIo(RPC_DIR_NAME, getCommunicationDirLocationSetting());
  // oxlint-disable-next-line typescript/unbound-method
  let rpc = new TalonRpcServer(io, commandRunner.runCommand);
  await io.initialize();

  onCommunicationDirLocationSettingChange(() => {
    io = new NodeIo(RPC_DIR_NAME, getCommunicationDirLocationSetting());
    // oxlint-disable-next-line typescript/unbound-method
    rpc = new TalonRpcServer(io, commandRunner.runCommand);
    void io.initialize();
  });

  let focusedElementType: FocusedElementType | undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "command-server.runCommand",
      async (focusedElementType_: FocusedElementType) => {
        focusedElementType = focusedElementType_;
        await rpc.executeRequest();
        focusedElementType = undefined;
      },
    ),

    vscode.commands.registerCommand(
      "command-server.getFocusedElementType",
      () => focusedElementType,
    ),
  );

  return {
    getFocusedElementType: () => Promise.resolve(focusedElementType),

    signals: {
      prePhrase: io.getInboundSignal("prePhrase"),
    },
  };
}
