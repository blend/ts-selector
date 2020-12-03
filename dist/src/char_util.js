"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSymbol = exports.isSelectorSymbol = exports.isNameSymbol = exports.isLowerAlpha = exports.isAlpha = exports.isWhitespace = void 0;
const constants = require("./constants");
function isWhitespace(ch) {
    return (ch.length === 1 &&
        (ch === constants.Space ||
            ch === constants.Tab ||
            ch === constants.CarriageReturn ||
            ch === constants.NewLine));
}
exports.isWhitespace = isWhitespace;
function isAlpha(ch) {
    return (ch.length === 1 && ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")));
}
exports.isAlpha = isAlpha;
function isLowerAlpha(ch) {
    return ch.length === 1 && ch >= "a" && ch <= "z";
}
exports.isLowerAlpha = isLowerAlpha;
function isNameSymbol(ch) {
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
exports.isNameSymbol = isNameSymbol;
function isSelectorSymbol(ch) {
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
exports.isSelectorSymbol = isSelectorSymbol;
function isSymbol(ch) {
    if (ch.length !== 1) {
        return false;
    }
    return ((ch >= constants.Bang && ch <= constants.ForwardSlash) ||
        (ch >= constants.Colon && ch <= constants.At) ||
        (ch >= constants.OpenBracket && ch <= constants.BackTick) ||
        (ch >= constants.OpenCurly && ch <= constants.Tilde));
}
exports.isSymbol = isSymbol;
//# sourceMappingURL=char_util.js.map