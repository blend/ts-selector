import { checkKey } from "./check_key";

/**
 * Represents an `NotHasKey` predicate tree node.
 *
 * It matches on a key not being present in a label set.
 * @public
 */
export default class NotHasKey implements ISelector {
  constructor(key: string) {
    this.key = key;
  }
  key: string;

  matches(labels: Record<string, string>): boolean {
    return labels[this.key] === undefined;
  }

  validate(): Error | null {
    return checkKey(this.key);
  }

  string(): string {
    return `!${this.key}`;
  }
}
