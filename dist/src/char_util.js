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
    return (ch.length === 1 &&
        ((ch >= "a" && ch <= "z") ||
            (ch >= "A" && ch <= "Z") ||
            (ch >= "0" && ch <= "9")));
}
exports.isAlpha = isAlpha;
function isLowerAlpha(ch) {
    return (ch.length === 1 && ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")));
}
exports.isLowerAlpha = isLowerAlpha;
function isNameSymbol(ch) {
    return (ch.length === 1 &&
        (ch === constants.Dot ||
            ch === constants.Dash ||
            ch === constants.Underscore));
}
exports.isNameSymbol = isNameSymbol;
function isSelectorSymbol(ch) {
    return (ch.length === 1 &&
        (ch === constants.Equal ||
            ch === constants.Bang ||
            ch === constants.OpenParens ||
            ch === constants.CloseParens ||
            ch === constants.Comma));
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