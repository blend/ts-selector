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
    ch.length === 1 && ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
  );
}

function isLowerAlpha(ch: string): boolean {
  return ch.length === 1 && ch >= "a" && ch <= "z";
}

function isNameSymbol(ch: string): boolean {
  if (ch.length !== 1) {
    return false;
  }
  switch (ch) {
    case (constants.Dot, constants.Dash, constants.Underscore):
      return true;
    default:
      return false;
  }
}

function isSelectorSymbol(ch: string): boolean {
  if (ch.length !== 1) {
    return false;
  }
  switch (ch) {
    case (constants.Equal,
    constants.Bang,
    constants.OpenParens,
    constants.CloseParens,
    constants.Comma):
      return true;
    default:
      return false;
  }
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
