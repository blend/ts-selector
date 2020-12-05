import { checkKey } from "./check_key";

/**
 * Represents an `HasKey` predicate tree node.
 *
 * It matches on a key being present in a label set, but makes no assertions about the value.
 * @public
 */
export default class HasKey implements ISelector {
  constructor(key: string) {
    this.key = key;
  }
  key: string;

  matches(labels: Record<string, string>): boolean {
    return labels[this.key] !== undefined;
  }

  validate(): Error | null {
    return checkKey(this.key);
  }

  string(): string {
    return this.key;
  }
}
