import { checkKey } from "./check_key";
import { checkValue } from "./check_value";
import { ISelector } from './interfaces';

/**
 * Represents an `In` predicate tree node.
 *
 * It matches on a value being in a given set of values.
 * @public
 */
export default class In implements ISelector {
  key: string;
  values: string[];

  constructor(key: string, values: string[]) {
    this.key = key;
    this.values = values;
  }

  matches(labels: Record<string, string>): boolean {
    // if the labels has a given key
    if (labels[this.key] !== undefined) {
      const value = labels[this.key];
      // for each selector value
      for (const iv of this.values) {
        // if they match, return true
        if (iv === value) {
          return true;
        }
      }
    }
    return false;
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
