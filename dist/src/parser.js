"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const and_node_1 = require("./and_node");
const any_node_1 = require("./any_node");
const has_key_node_1 = require("./has_key_node");
const not_has_key_node_1 = require("./not_has_key_node");
const equals_node_1 = require("./equals_node");
const not_equals_node_1 = require("./not_equals_node");
const in_node_1 = require("./in_node");
const not_in_node_1 = require("./not_in_node");
const constants = require("./constants");
const errors = require("./errors");
const charUtil = require("./char_util");
// Parser is a parser for selectors.
class Parser {
    constructor(input, opts) {
        this.options = opts !== null && opts !== void 0 ? opts : { skipValidation: false };
        this.s = input;
        this.pos = 0;
        this.m = 0;
    }
    // mustParse parses the selector and throws an exception
    mustParse() {
        const sel = this.parse();
        if (sel instanceof Error) {
            throw sel;
        }
        return sel;
    }
    // parse parses the selector and returns a selector or an error
    parse() {
        this.s = this.s.trim();
        if (this.s.length === 0) {
            return new any_node_1.default();
        }
        let b = "";
        let selector = null;
        let op = "";
        for (;;) {
            b = this.current();
            if (b === constants.Bang) {
                this.advance();
                selector = this.addAnd(selector, this.notHasKey(this.readWord()));
                if (this.done()) {
                    break;
                }
                continue;
            }
            const key = this.readWord();
            this.mark();
            b = this.skipToComma();
            if (b === constants.Comma || this.isTerminator(b) || this.done()) {
                selector = this.addAnd(selector, this.hasKey(key));
                this.advance();
                if (this.done()) {
                    break;
                }
                continue;
            }
            else {
                this.popMark();
            }
            op = this.readOp();
            if (op instanceof Error) {
                return op;
            }
            let subSelector = null;
            switch (op) {
                case constants.OpEquals:
                    subSelector = this.equals(key);
                    break;
                case constants.OpDoubleEquals:
                    subSelector = this.equals(key);
                    break;
                case constants.OpNotEquals:
                    subSelector = this.notEquals(key);
                    break;
                case constants.OpIn:
                    subSelector = this.in(key);
                    break;
                case constants.OpNotIn:
                    subSelector = this.notIn(key);
                    break;
                default:
                    return errors.ErrInvalidOperator;
            }
            if (subSelector instanceof Error) {
                return subSelector;
            }
            if (!subSelector) {
                return errors.ErrInvalidOperator;
            }
            selector = this.addAnd(selector, subSelector);
            b = this.skipToComma();
            if (b === constants.Comma) {
                this.advance();
                if (this.done()) {
                    break;
                }
                continue;
            }
            if (this.isTerminator(b) || this.done()) {
                break;
            }
            return errors.ErrInvalidSelector;
        }
        if (!this.options.skipValidation) {
            const validationErr = selector.validate();
            if (validationErr) {
                return validationErr;
            }
        }
        return selector;
    }
    current() {
        return this.s.charAt(this.pos);
    }
    advance() {
        if (this.pos < this.s.length) {
            this.pos++;
        }
    }
    done() {
        return this.pos === this.s.length;
    }
    mark() {
        this.m = this.pos;
    }
    popMark() {
        if (this.m > 0) {
            this.pos = this.m;
        }
        this.m = 0;
    }
    // addAnd starts grouping selectors into a high level `and`, returning the aggregate selector.
    addAnd(current, next) {
        if (current === null) {
            return next;
        }
        if (current instanceof and_node_1.default) {
            current.children.push(next);
            return current;
        }
        return new and_node_1.default([current, next]);
    }
    hasKey(key) {
        return new has_key_node_1.default(key);
    }
    notHasKey(key) {
        return new not_has_key_node_1.default(key);
    }
    equals(key) {
        const value = this.readWord();
        return new equals_node_1.default(key, value);
    }
    notEquals(key) {
        const value = this.readWord();
        return new not_equals_node_1.default(key, value);
    }
    in(key) {
        const csv = this.readCSV();
        if (csv instanceof Error) {
            return csv;
        }
        return new in_node_1.default(key, csv);
    }
    notIn(key) {
        const csv = this.readCSV();
        if (csv instanceof Error) {
            return csv;
        }
        return new not_in_node_1.default(key, csv);
    }
    // readOp reads a valid operator.
    // valid operators include:
    // [ =, ==, !=, in, notin ]
    // errors if it doesn't read one of the above, or there is another structural issue.
    readOp() {
        // skip preceding whitespace
        this.skipWhitespace();
        let state = 0;
        let ch = "";
        const op = [];
        for (;;) {
            ch = this.current();
            switch (state) {
                case 0: // initial state, determine what op we're reading for
                    if (ch === constants.Equal) {
                        state = 1;
                        break;
                    }
                    if (ch === constants.Bang) {
                        state = 2;
                        break;
                    }
                    if (ch === "i") {
                        state = 6;
                        break;
                    }
                    if (ch === "n") {
                        state = 7;
                        break;
                    }
                    return errors.ErrInvalidOperator;
                case 1: // =
                    if (this.isWhitespace(ch) ||
                        this.isAlpha(ch) ||
                        ch === constants.Comma) {
                        return op.join("");
                    }
                    if (ch === constants.Equal) {
                        op.push(ch);
                        this.advance();
                        return op.join("");
                    }
                    return errors.ErrInvalidOperator;
                case 2: // !
                    if (ch === constants.Equal) {
                        op.push(ch);
                        this.advance();
                        return op.join("");
                    }
                    return errors.ErrInvalidOperator;
                case 6: // look for "in" based on "i"
                    if (ch === "n") {
                        // finishes "in"
                        op.push(ch);
                        this.advance();
                        return op.join("");
                    }
                    return errors.ErrInvalidOperator;
                case 7: // o
                    if (ch === "o") {
                        state = 8;
                        break;
                    }
                    return errors.ErrInvalidOperator;
                case 8: // t
                    if (ch === "t") {
                        state = 9;
                        break;
                    }
                    return errors.ErrInvalidOperator;
                case 9: // i
                    if (ch === "i") {
                        state = 10;
                        break;
                    }
                    return errors.ErrInvalidOperator;
                case 10: // n
                    if (ch === "n") {
                        op.push(ch);
                        this.advance();
                        return op.join("");
                    }
                    return errors.ErrInvalidOperator;
            }
            op.push(ch);
            this.advance();
            if (this.done()) {
                return op.join("");
            }
        }
    }
    // readWord skips whitespace, then reads a word until whitespace or a token.
    // it will leave the cursor on the next char after the word, i.e. the space or token.
    readWord() {
        // skip preceding whitespace
        this.skipWhitespace();
        const word = [];
        let ch = "";
        for (;;) {
            ch = this.current();
            if (this.isWhitespace(ch)) {
                return word.join("");
            }
            if (this.isSpecialSymbol(ch)) {
                return word.join("");
            }
            word.push(ch);
            this.advance();
            if (this.done()) {
                return word.join("");
            }
        }
    }
    readCSV() {
        const results = [];
        // skip preceding whitespace
        this.skipWhitespace();
        let word = [];
        let ch = "";
        let state = 0;
        for (;;) {
            ch = this.current();
            if (this.done()) {
                return errors.ErrInvalidSelector;
            }
            switch (state) {
                case 0: // leading paren
                    if (ch === constants.OpenParens) {
                        state = 2; // spaces or alphas
                        this.advance();
                        continue;
                    }
                    // not open parens, bail
                    return errors.ErrInvalidSelector;
                case 1: // alphas (in word)
                    if (ch === constants.Comma) {
                        if (word.length > 0) {
                            results.push(word.join(""));
                            word = [];
                        }
                        state = 2; // from comma
                        this.advance();
                        continue;
                    }
                    if (ch === constants.CloseParens) {
                        if (word.length > 0) {
                            results.push(word.join(""));
                        }
                        this.advance();
                        return results;
                    }
                    if (this.isWhitespace(ch)) {
                        state = 3;
                        this.advance();
                        continue;
                    }
                    if (!this.isValidValue(ch)) {
                        return errors.ErrInvalidSelector;
                    }
                    word.push(ch);
                    this.advance();
                    continue;
                case 2: //whitespace after symbol
                    if (ch === constants.CloseParens) {
                        this.advance();
                        return results;
                    }
                    if (this.isWhitespace(ch)) {
                        this.advance();
                        continue;
                    }
                    if (ch === constants.Comma) {
                        this.advance();
                        continue;
                    }
                    if (this.isAlpha(ch)) {
                        state = 1;
                        continue;
                    }
                    return errors.ErrInvalidSelector;
                case 3: //whitespace after alpha
                    if (ch === constants.CloseParens) {
                        if (word.length > 0) {
                            results.push(word.join(""));
                        }
                        this.advance();
                        return results;
                    }
                    if (this.isWhitespace(ch)) {
                        this.advance();
                        continue;
                    }
                    if (ch === constants.Comma) {
                        if (word.length > 0) {
                            results.push(word.join(""));
                            word = [];
                        }
                        this.advance();
                        state = 2;
                        continue;
                    }
                    return errors.ErrInvalidSelector;
            }
        }
    }
    skipWhitespace() {
        if (this.done()) {
            return;
        }
        let ch = "";
        for (;;) {
            ch = this.current();
            if (!this.isWhitespace(ch)) {
                return;
            }
            this.advance();
            if (this.done()) {
                return;
            }
        }
    }
    skipToComma() {
        let ch = "";
        if (this.done()) {
            return ch;
        }
        for (;;) {
            ch = this.current();
            if (ch == constants.Comma) {
                return ch;
            }
            if (!this.isWhitespace(ch)) {
                return ch;
            }
            this.advance();
            if (this.done()) {
                return ch;
            }
        }
    }
    isWhitespace(ch) {
        return charUtil.isWhitespace(ch);
    }
    isSpecialSymbol(ch) {
        return (ch.length === 1 &&
            (ch === constants.Equal ||
                ch === constants.Bang ||
                ch === constants.CloseParens ||
                ch === constants.Comma));
    }
    isTerminator(ch) {
        return ch.length === 1 && ch === "\0";
    }
    isAlpha(ch) {
        return charUtil.isAlpha(ch);
    }
    isValidValue(ch) {
        return this.isAlpha(ch) || this.isNameSymbol(ch);
    }
    isNameSymbol(ch) {
        return (ch.length === 1 &&
            (ch === constants.Equal ||
                ch === constants.Bang ||
                ch === constants.OpenParens ||
                ch === constants.CloseParens ||
                ch === constants.Comma));
    }
}
exports.default = Parser;
//# sourceMappingURL=parser.js.map