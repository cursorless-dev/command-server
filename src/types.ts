/**
 * The type of the focused element in vscode at the moment of the command being executed.
 */
export type FocusedElementType = "textEditor" | "terminal" | "other";

interface Signal {
  getVersion: () => Promise<string | null>;
}

export interface ReturnApi {
  /**
   * The type of the focused element in vscode at the moment of the command being executed.
   */
  getFocusedElementType: () => Promise<FocusedElementType | undefined>;

  /**
   * These signals can be used as a form of IPC to indicate that an event has
   * occurred.
   */
  signals: {
    /**
     * This signal is emitted by the voice engine to indicate that a phrase has
     * just begun execution.
     */
    prePhrase: Signal;
  };
}
