// ISelector is a type that implements selector.
declare interface ISelector {
  matches(labels: Map<string, string>): boolean;
  validate(): Error | null;
  string(): string;
}

// IParserOpts are options for parsing selectors.
declare interface IParserOpts {
  skipValidation: boolean;
}
