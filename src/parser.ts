import AndNode from "./and_node";
import AnyNode from "./any_node";
import HasKeyNode from "./has_key_node";
import NotHasKeyNode from "./not_has_key_node";
import EqualsNode from "./equals_node";
import NotEqualsNode from "./not_equals_node";
import InNode from "./in_node";
import NotInNode from "./not_in_node";
import * as constants from "./constants";
import * as errors from "./errors";

// Parser is a parser for selectors.
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

  // mustParse parses the selector and throws an exception
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
      return new AnyNode();
    }

    let b = "";
    let selector: ISelector | null = null;
    let op: string | Error = "";

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
      } else {
        this.popMark();
      }

      op = this.readOp();
      if (op instanceof Error) {
        return op as Error;
      }

      let subSelector: ISelector | Error | null = null;

      switch (op as string) {
        case (constants.OpEquals, constants.OpDoubleEquals):
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
        return subSelector as Error;
      }
      if (!subSelector) {
        return errors.ErrInvalidOperator;
      }
      selector = this.addAnd(selector, subSelector as ISelector);

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

  // addAnd starts grouping selectors into a high level `and`, returning the aggregate selector.
  addAnd(current: ISelector | null, next: ISelector): ISelector {
    if (current === null) {
      return next;
    }
    if (current as AndNode) {
      (current as AndNode).children.push(next);
      return current;
    }
    return new AndNode([current, next]);
  }
  hasKey(key: string): ISelector {
    return new HasKeyNode(key);
  }
  notHasKey(key: string): ISelector {
    return new NotHasKeyNode(key);
  }
  equals(key: string): ISelector {
    const value = this.readWord();
    return new EqualsNode(key, value);
  }
  notEquals(key: string): ISelector {
    const value = this.readWord();
    return new NotEqualsNode(key, value);
  }
  in(key: string): ISelector | Error {
    const csv = this.readCSV();
    if (csv instanceof Error) {
      return csv as Error;
    }
    return new InNode(key, csv as string[]);
  }
  notIn(key: string): ISelector | Error {
    const csv = this.readCSV();
    if (csv instanceof Error) {
      return csv as Error;
    }
    return new NotInNode(key, csv as string[]);
  }

  // readOp reads a valid operator.
  // valid operators include:
  // [ =, ==, !=, in, notin ]
  // errors if it doesn't read one of the above, or there is another structural issue.
  readOp(): string | Error {
    // skip preceding whitespace
    this.skipWhiteSpace();

    let state = 0;
    let ch = "";
    const op: string[] = [];
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

        case 2: // !
          if (ch === constants.Equal) {
            op.push(ch);
            this.advance();
            return op.join("");
          }
          return errors.ErrInvalidOperator;

        case 6: // in
          if (ch === "n") {
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
  readWord(): string {
    // skip preceding whitespace
    this.skipWhiteSpace();
    const word: string[] = [];
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

  readCSV(): string[] | Error {
    const results: string[] = [];

    // skip preceding whitespace
    this.skipWhiteSpace();

    let word: string[] = [];
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

  skipWhiteSpace(): void {
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

  skipToComma(): string {
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

  isWhitespace(ch: string): boolean {
    return (
      ch.length === 1 &&
      (ch === constants.Space ||
        ch === constants.Tab ||
        ch === constants.CarriageReturn ||
        ch === constants.NewLine)
    );
  }
  isSpecialSymbol(ch: string): boolean {
    return (
      ch.length === 1 &&
      (ch === constants.Equal ||
        ch === constants.Bang ||
        ch === constants.CloseParens ||
        ch === constants.Comma)
    );
  }
  isTerminator(ch: string): boolean {
    return ch.length === 1 && ch === "\0";
  }
  isAlpha(ch: string): boolean {
    return (
      ch.length === 1 && ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
    );
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
