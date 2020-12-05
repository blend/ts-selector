import { checkKey } from "./check_key";
import { checkValue } from "./check_value";

/**
 * Represents an `NotEquals` predicate tree node.
 *
 * It matches on a key missing, or a key being present and the
 * value not equal to a given value.
 * @public
 */
export default class NotEquals implements ISelector {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
  matches(labels: Record<string, string>): boolean {
    if (labels[this.key] !== undefined) {
      return labels[this.key] !== this.value;
    }
    return true;
  }
  validate(): Error | null {
    let err = checkKey(this.key);
    if (err) {
      return err;
    }
    err = checkValue(this.value);
    return err;
  }
  string(): string {
    return `${this.key} != ${this.value}`;
  }
}
