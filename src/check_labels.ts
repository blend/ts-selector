import { checkKey } from "./check_key";
import { checkValue } from "./check_value";

function checkLabels(labels: Record<string, string>): Error | null {
  let err: Error | null = null;
  let value = "";
  for (const key in labels) {
    err = checkKey(key);
    if (err) {
      return new Error(`selector labels have invalid key: ${key}, ${err}`);
    }

    value = labels[key];
    err = checkValue(value);
    if (err) {
      return new Error(
        `selector labels have invalid value: ${value}, for key: ${key}, ${err}`
      );
    }
  }
  return null;
}

export { checkLabels };
