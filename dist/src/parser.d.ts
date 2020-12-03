export default class Parser {
    options: IParserOpts;
    private s;
    private pos;
    private m;
    constructor(input: string, opts?: IParserOpts);
    mustParse(): ISelector;
    parse(): ISelector | Error;
    current(): string;
    advance(): void;
    done(): boolean;
    mark(): void;
    popMark(): void;
    addAnd(current: ISelector | null, next: ISelector): ISelector;
    hasKey(key: string): ISelector;
    notHasKey(key: string): ISelector;
    equals(key: string): ISelector;
    notEquals(key: string): ISelector;
    in(key: string): ISelector | Error;
    notIn(key: string): ISelector | Error;
    readOp(): string | Error;
    readWord(): string;
    readCSV(): string[] | Error;
    skipWhiteSpace(): void;
    skipToComma(): string;
    isWhitespace(ch: string): boolean;
    isSpecialSymbol(ch: string): boolean;
    isTerminator(ch: string): boolean;
    isAlpha(ch: string): boolean;
    isValidValue(ch: string): boolean;
    isNameSymbol(ch: string): boolean;
}