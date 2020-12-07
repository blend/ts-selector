// ISelector is a type that implements selector.
export interface ISelector {
  matches(labels: Record<string, string>): boolean;
  validate(): Error | null;
  string(): string;
}

// IParserOpts are options for parsing selectors.
export interface IParserOpts {
  skipValidation: boolean;
}
