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

function isSelectorSymbol(ch: string): boolean {
  return (
    ch.length === 1 &&
    (ch === constants.Equal ||
      ch === constants.Bang ||
      ch === constants.OpenParens ||
      ch === constants.CloseParens ||
      ch === constants.Comma)
  );
}

function isSymbol(ch: string): boolean {
  if (ch.length !== 1) {
    return false;
  }

  return (
    (ch >= constants.Bang && ch <= constants.ForwardSlash) ||
    (ch >= constants.Colon && ch <= constants.At) ||
    (ch >= constants.OpenBracket && ch <= constants.BackTick) ||
    (ch >= constants.OpenCurly && ch <= constants.Tilde)
  );
}

export {
  isWhitespace,
  isAlpha,
  isLowerAlpha,
  isNameSymbol,
  isSelectorSymbol,
  isSymbol,
};
