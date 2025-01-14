import { sync as rimrafSync } from "rimraf";
import { NodeIo } from "talon-rpc";
import { RPC_DIR_NAME } from "./constants";

function main() {
  const io = new NodeIo(RPC_DIR_NAME);
  rimrafSync(io.dirPath, { disableGlob: true });
}

main();
