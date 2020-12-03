import * as constants from "./constants";
import * as errors from "./errors";
import { checkName } from "./check_name";

// checkValue returns if the label value is valid.
function checkValue(value: string): Error | null {
  if (value.length > constants.MaxValueLen) {
    return errors.ErrValueTooLong;
  }
  return checkName(value);
}

export { checkValue };
