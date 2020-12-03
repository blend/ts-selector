import { checkKey } from "./check_key";

// HasKey returns if a label set has a given key.
export default class NotHasKeyNode implements ISelector {
  constructor(key: string) {
    this.key = key;
  }
  key: string;

  matches(labels: Map<string, string>): boolean {
    if (!labels) {
      return false;
    }
    return !labels.has(this.key);
  }

  validate(): Error | null {
    return checkKey(this.key);
  }

  string(): string {
    return this.key;
  }
}
