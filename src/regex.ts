import { Minimatch } from "minimatch";

export function globsToRegex(globs: string[]): RegExp | undefined {
  const regexes = globs
    .map((glob) => new Minimatch(glob).makeRe())
    .filter((regex): regex is RegExp => regex !== false);
  return regexes.length > 0 ? any(regexes) : undefined;
}

/**
 * Creates a new regex that is the disjunction of its arguments.
 * Based on https://stackoverflow.com/a/9215436
 * @param args Regexes to combine
 * @returns A regex that will match any of the given Regexes
 */
function any(args: RegExp[]): RegExp {
  const components = args.map((arg) => arg.source);
  return new RegExp(`(?:${components.join(")|(?:")})`);
}
