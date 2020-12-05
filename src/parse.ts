import Parser from "./parser";

/**
 * Parses a selector into a predicate tree and throws errors returned as exceptions.
 * @public
 */
function mustParse(sel: string): ISelector {
  return new Parser(sel).mustParse();
}

/**
 * Parses a selector into a predicate tree and returns either the selector or the error.
 * @public
 */
function parse(sel: string): ISelector | Error {
  return new Parser(sel).parse();
}

export { mustParse, parse };
