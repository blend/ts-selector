import And from "./and";
import Any from "./any";
import HasKey from "./has_key";
import NotHasKey from "./not_has_key";
import Equals from "./equals";
import NotEquals from "./not_equals";
import In from "./in";
import NotIn from "./not_in";
import * as constants from "./constants";
import * as errors from "./errors";
import * as charUtil from "./char_util";
import { IParserOpts, ISelector } from './interfaces';

/**
 * Parser implements the state machine that parses selectors into predicate trees.
 *
 * You can use this class directly, or use the helper methods `parse` and `mustParse`.
 * @public
 */
export default class Parser {
  public options: IParserOpts;
  private s: string;
  private pos: number;
  private m: number;

  constructor(input: string, opts?: IParserOpts) {
    this.options = opts ?? { skipValidation: false };
    this.s = input;
    this.pos = 0;
    this.m = 0;
  }

  // mustParse parses the selector and throws an exception if there is an error
  mustParse(): ISelector {
    const sel = this.parse();
    if (sel instanceof Error) {
      throw sel as Error;
    }
    return sel as ISelector;
  }

  // parse parses the selector and returns a selector or an error
  parse(): ISelector | Error {
    this.s = this.s.trim();
    if (this.s.length === 0) {
      return new Any();
    }

    let b = "";
    let selector: ISelector | null = null;
    let selectorOrError: ISelector | Error | null = null;
    let word: string | Error = "";
    let op: string | Error = "";

    for (;;) {
      b = this.current();

      // this has to be a not_has_key
      if (b === constants.Bang) {
        this.advance();

        word = this.readWord();
        if (word instanceof Error) {
          return word as Error;
        }

        selector = this.addAnd(selector, this.notHasKey(word as string));
        if (this.done()) {
          break;
        }
        this.skipToNonWhitespace();
        if (this.current() !== constants.Comma) {
          return errors.ErrInvalidSelector;
        }
        continue;
      }

      word = this.readWord();
      if (word instanceof Error) {
        return word as Error;
      }

      this.mark(); // mark to revert if the sniff fails

      // sniff if the next character after the word is a comma
      // this indicates it's a "key" form, or existence check on a key
      b = this.skipToNonWhitespace();
      if (b === constants.Comma || this.isTerminator(b) || this.done()) {
        selector = this.addAnd(selector, this.hasKey(word as string));

        this.advance();
        if (this.done()) {
          break;
        }
        this.skipToNonWhitespace();
        continue;
      } else {
        this.popMark();
      }

      op = this.readOp();
      if (op instanceof Error) {
        return op as Error;
      }

      switch (op as string) {
        case constants.OpEquals:
          selectorOrError = this.equals(word as string);
          break;
        case constants.OpDoubleEquals:
          selectorOrError = this.equals(word as string);
          break;
        case constants.OpNotEquals:
          selectorOrError = this.notEquals(word as string);
          break;
        case constants.OpIn:
          selectorOrError = this.in(word as string);
          break;
        case constants.OpNotIn:
          selectorOrError = this.notIn(word as string);
          break;
      }
      if (this.checkSelectorOrError(selectorOrError)) {
        return this.checkSelectorOrError(selectorOrError) as Error;
      }
      selector = this.addAnd(selector, selectorOrError as ISelector);

      b = this.skipToNonWhitespace();
      if (b === constants.Comma) {
        this.advance();
        if (this.done()) {
          break;
        }

        this.skipToNonWhitespace();
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

  current(): string {
    return this.s.charAt(this.pos);
  }
  advance(): void {
    if (this.pos < this.s.length) {
      this.pos++;
    }
  }
  done(): boolean {
    return this.pos === this.s.length;
  }
  mark(): void {
    this.m = this.pos;
  }
  popMark(): void {
    if (this.m > 0) {
      this.pos = this.m;
    }
    this.m = 0;
  }

  checkSelectorOrError(sel: ISelector | Error | null): Error | null {
    if (sel instanceof Error) {
      return sel as Error;
    }
    if (!sel) {
      return errors.ErrInvalidOperator;
    }
    return null;
  }

  // addAnd starts grouping selectors into a high level `and`, returning the aggregate selector.
  addAnd(current: ISelector | null, next: ISelector): ISelector {
    if (current === null) {
      return next;
    }
    if (current instanceof And) {
      (current as And).children.push(next);
      return current;
    }
    return new And([current, next]);
  }
  hasKey(key: string): ISelector {
    return new HasKey(key);
  }
  notHasKey(key: string): ISelector {
    return new NotHasKey(key);
  }
  equals(key: string): ISelector | Error {
    const value = this.readWord();
    if (value instanceof Error) {
      return value as Error;
    }
    return new Equals(key, value);
  }
  notEquals(key: string): ISelector | Error {
    const value = this.readWord();
    if (value instanceof Error) {
      return value as Error;
    }
    return new NotEquals(key, value);
  }
  in(key: string): ISelector | Error {
    const csv = this.readCSV();
    if (csv instanceof Error) {
      return csv as Error;
    }
    return new In(key, csv as string[]);
  }
  notIn(key: string): ISelector | Error {
    const csv = this.readCSV();
    if (csv instanceof Error) {
      return csv as Error;
    }
    return new NotIn(key, csv as string[]);
  }

  // readOp reads a valid operator.
  // valid operators include:
  // [ =, ==, !=, in, notin ]
  // errors if it doesn't read one of the above, or there is another structural issue.
  readOp(): string | Error {
    // skip preceding whitespace
    this.skipWhitespace();

    const stateFirstOpChar = 0;
    const stateEqual = 1;
    const stateBang = 2;
    const stateInI = 3;
    const stateNotInN = 4;
    const stateNotInO = 5;
    const stateNotInT = 6;
    const stateNotInI = 7;

    let state = stateFirstOpChar;
    let ch = "";
    const op: string[] = [];

    for (;;) {
      if (this.done()) {
        return op.join("");
      }

      ch = this.current();

      switch (state) {
        case stateFirstOpChar: // initial state, determine what op we're reading for
          if (ch === constants.Equal) {
            state = stateEqual;
            break;
          }
          if (ch === constants.Bang) {
            state = stateBang;
            break;
          }
          if (ch === "i") {
            state = stateInI;
            break;
          }
          if (ch === "n") {
            state = stateNotInN;
            break;
          }

          return errors.ErrInvalidOperator;

        case stateEqual: // =
          if (
            this.isWhitespace(ch) ||
            this.isAlpha(ch) ||
            ch === constants.Comma
          ) {
            return op.join("");
          }

          if (ch === constants.Equal) {
            op.push(ch);
            this.advance();
            return op.join("");
          }

          return errors.ErrInvalidOperator;

        case stateBang: // !
          if (ch === constants.Equal) {
            op.push(ch);
            this.advance();
            return op.join("");
          }

          return errors.ErrInvalidOperator;

        case stateInI:
          if (ch === "n") {
            op.push(ch);
            this.advance();
            return op.join("");
          }

          return errors.ErrInvalidOperator;

        case stateNotInN:
          if (ch === "o") {
            state = stateNotInO;
            break;
          }

          return errors.ErrInvalidOperator;

        case stateNotInO: // t
          if (ch === "t") {
            state = stateNotInT;
            break;
          }

          return errors.ErrInvalidOperator;

        case stateNotInT:
          if (ch === "i") {
            state = stateNotInI;
            break;
          }

          return errors.ErrInvalidOperator;

        case stateNotInI:
          if (ch === "n") {
            op.push(ch);
            this.advance();
            return op.join("");
          }

          return errors.ErrInvalidOperator;
      }

      op.push(ch);
      this.advance();
    }
  }

  // readWord skips whitespace, then reads a word until whitespace or a token.
  // it will leave the cursor on the next char after the word, i.e. the space or token.
  readWord(): string | Error {
    this.skipWhitespace();

    const word: string[] = [];
    let ch = "";
    for (;;) {
      if (this.done()) {
        break;
      }

      ch = this.current();

      if (
        this.isWhitespace(ch) ||
        ch == constants.Comma ||
        this.isOperatorSymbol(ch)
      ) {
        break;
      }

      word.push(ch);
      this.advance();
    }
    if (word.length === 0) {
      return errors.ErrInvalidSelector;
    }
    return word.join("");
  }

  readCSV(): string[] | Error {
    const results: string[] = [];

    // skip preceding whitespace
    this.skipWhitespace();

    const stateBeforeParens = 0;
    const stateWord = 1;
    const stateWhitespaceAfterSymbol = 2;
    const stateWhitespaceAfterWord = 3;

    let word: string[] = [];
    let ch = "";
    let state = 0;

    for (;;) {
      if (this.done()) {
        return errors.ErrInvalidSelector;
      }

      ch = this.current();

      switch (state) {
        case stateBeforeParens: // leading paren
          if (ch === constants.OpenParens) {
            state = stateWhitespaceAfterSymbol; // spaces or alphas
            this.advance();
            continue;
          }

          // not open parens, bail
          return errors.ErrInvalidSelector;
        case stateWord: // alphas (in word)
          if (ch === constants.Comma) {
            if (word.length > 0) {
              results.push(word.join(""));
              word = [];
            }

            // the symbol is the comma
            state = stateWhitespaceAfterSymbol;
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
            if (word.length > 0) {
              results.push(word.join(""));
            }

            state = stateWhitespaceAfterWord;
            this.advance();
            continue;
          }

          if (!this.isValidValue(ch)) {
            return errors.ErrInvalidSelector;
          }

          word.push(ch);
          this.advance();
          continue;

        case stateWhitespaceAfterSymbol:
          if (this.isWhitespace(ch)) {
            this.advance();
            continue;
          }

          if (ch === constants.Comma) {
            this.advance();
            continue;
          }

          if (this.isAlpha(ch)) {
            state = stateWord;
            continue;
          }

          if (ch === constants.CloseParens) {
            this.advance();
            return results;
          }

          return errors.ErrInvalidSelector;

        case stateWhitespaceAfterWord:
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
            state = stateWhitespaceAfterSymbol;
            this.advance();
            continue;
          }
          return errors.ErrInvalidSelector;
      }
    }
  }

  skipWhitespace(): void {
    let ch = "";
    for (;;) {
      if (this.done()) {
        return;
      }
      ch = this.current();
      if (!this.isWhitespace(ch)) {
        return;
      }
      this.advance();
    }
  }

  skipToNonWhitespace(): string {
    let ch = "";
    for (;;) {
      if (this.done()) {
        return ch;
      }
      ch = this.current();
      if (ch == constants.Comma) {
        return ch;
      }
      if (!this.isWhitespace(ch)) {
        return ch;
      }
      this.advance();
    }
  }

  isWhitespace(ch: string): boolean {
    return charUtil.isWhitespace(ch);
  }
  isOperatorSymbol(ch: string): boolean {
    return ch.length === 1 && (ch === constants.Bang || ch === constants.Equal);
  }
  isTerminator(ch: string): boolean {
    return ch.length === 1 && ch === "\0";
  }
  isAlpha(ch: string): boolean {
    return charUtil.isAlpha(ch);
  }
  isValidValue(ch: string): boolean {
    return this.isAlpha(ch) || this.isNameSymbol(ch);
  }
  isNameSymbol(ch: string): boolean {
    return (
      ch.length === 1 &&
      (ch === constants.Equal ||
        ch === constants.Bang ||
        ch === constants.OpenParens ||
        ch === constants.CloseParens ||
        ch === constants.Comma)
    );
  }
}
