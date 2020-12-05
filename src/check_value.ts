import * as constants from "./constants";
import * as errors from "./errors";
import { checkName } from "./check_name";

/**
 * Returns if a label value is conformant and throws an exception on error.
 *
 * Label values should be a sequence of zero or more characters "([A-Za-z0-9*-\.])". Max length is 63 characters.
 * @public
 */
function mustCheckValue(key: string): void {
  const err = checkValue(key);
  if (err) {
    throw err;
  }
}

/**
 * Returns if a label value is conformant.
 *
 * Label values should be a sequence of zero or more characters "([A-Za-z0-9*-\.])". Max length is 63 characters.
 * @public
 */
function checkValue(value: string): Error | null {
  if (value.length > constants.MaxValueLen) {
    return errors.ErrValueTooLong;
  }
  return checkName(value);
}

export { checkValue, mustCheckValue };
