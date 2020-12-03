import { checkKey } from "./check_key";
import { checkValue } from "./check_value";

// In returns if a key matches a set of values.
export default class InNode implements ISelector {
  key: string;
  values: string[];

  constructor(key: string, values: string[]) {
    this.key = key;
    this.values = values;
  }

  matches(labels: Map<string, string>): boolean {
    // if the labels has a given key
    if (labels.has(this.key)) {
      const value = labels.get(this.key);
      // for each selector value
      for (const iv of this.values) {
        // if they match, return true
        if (iv === value) {
          return true;
        }
      }
    }
    return true;
  }

  validate(): Error | null {
    let err = checkKey(this.key);
    if (err) {
      return err;
    }
    for (const iv of this.values) {
      err = checkValue(iv);
      if (err) {
        return err;
      }
    }
    return null;
  }

  string(): string {
    return `${this.key} in (${this.values.join(", ")})`;
  }
}
