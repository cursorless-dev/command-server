import fastGlob from "fast-glob";
import Mocha from "mocha";

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const cwd = __dirname;

  const files = fastGlob
    .sync("**/**.test.js", {
      cwd,
      absolute: true,
    })
    .toSorted();

  for (const file of files) {
    mocha.addFile(file);
  }

  // oxlint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (error) {
      console.error(error);
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}
