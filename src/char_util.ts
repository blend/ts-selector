import * as constants from "./constants";

function isWhitespace(ch: string): boolean {
  return (
    ch.length === 1 &&
    (ch === constants.Space ||
      ch === constants.Tab ||
      ch === constants.CarriageReturn ||
      ch === constants.NewLine)
  );
}

function isAlpha(ch: string): boolean {
  return (
    ch.length === 1 &&
    ((ch >= "a" && ch <= "z") ||
      (ch >= "A" && ch <= "Z") ||
      (ch >= "0" && ch <= "9"))
  );
}

function isLowerAlpha(ch: string): boolean {
  return (
    ch.length === 1 && ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9"))
  );
}

function isNameSymbol(ch: string): boolean {
  return (
    ch.length === 1 &&
    (ch === constants.Dot ||
      ch === constants.Dash ||
      ch === constants.Underscore)
  );
}

export { isWhitespace, isAlpha, isLowerAlpha, isNameSymbol };
