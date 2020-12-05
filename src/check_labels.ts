import { checkKey } from "./check_key";
import { checkValue } from "./check_value";

/**
 * Returns if a set of labels is conformant and throws an exception on error.
 *
 *
 * Label keys should be a sequence of one or more characters following [ DNS_SUBDOMAIN "/" ] DNS*LABEL. Max length is 63 characters.
 * Label values should be a sequence of zero or more characters "([A-Za-z0-9*-\.])". Max length is 63 characters.
 * @public
 */
function mustCheckLabels(labels: Record<string, string>): void {
  const err = checkLabels(labels);
  if (err) {
    throw err;
  }
}

/**
 * Returns if a set of labels is conformant.
 *
 * Label keys should be a sequence of one or more characters following [ DNS_SUBDOMAIN "/" ] DNS*LABEL. Max length is 63 characters.
 * Label values should be a sequence of zero or more characters "([A-Za-z0-9*-\.])". Max length is 63 characters.
 * @public
 */
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

export { checkLabels, mustCheckLabels };
