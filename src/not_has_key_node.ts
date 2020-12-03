import { checkKey } from "./check_key";

// HasKey returns if a label set has a given key.
export default class NotHasKeyNode implements ISelector {
  constructor(key: string) {
    this.key = key;
  }
  key: string;

  matches(labels: Record<string, string>): boolean {
    if (!labels) {
      return false;
    }
    return labels[this.key] === undefined;
  }

  validate(): Error | null {
    return checkKey(this.key);
  }

  string(): string {
    return this.key;
  }
}
