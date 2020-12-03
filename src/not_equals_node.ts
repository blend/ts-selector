import { checkKey } from "./check_key";
import { checkValue } from "./check_value";

// NotEqualsNode returns if a key strictly does not equals a value.
export default class NotEqualsNode implements ISelector {
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
