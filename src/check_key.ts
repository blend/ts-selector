import * as constants from "./constants";
import * as errors from "./errors";
import { checkDNS } from "./check_dns";
import { checkName } from "./check_name";

/**
 * Returns if a label key is conformant and throws an exception on error.
 *
 * Label keys should be a sequence of one or more characters following [ DNS_SUBDOMAIN "/" ] DNS*LABEL. Max length is 63 characters.
 * @public
 */
function mustCheckKey(key: string): void {
  const err = checkKey(key);
  if (err) {
    throw err;
  }
}

/**
 * Returns if a label key is conformant.
 *
 * Label keys should be a sequence of one or more characters following [ DNS_SUBDOMAIN "/" ] DNS*LABEL. Max length is 63 characters.
 * @public
 */
function checkKey(key: string): Error | null {
  const keyLen = key.length;
  if (keyLen === 0) {
    return errors.ErrKeyEmpty;
  }
  if (keyLen > constants.MaxKeyTotalLen) {
    return errors.ErrKeyTooLong;
  }

  let working: string[] = [];
  let state = 0;
  let ch = "";
  let err: Error | null = null;
  for (let pos = 0; pos < keyLen; pos++) {
    ch = key.charAt(pos);

    if (state === 0) {
      if (ch === constants.ForwardSlash) {
        err = checkDNS(working.join(""));
        if (err) {
          return err;
        }
        working = [];
        state = 1;
        continue;
      }
    }

    working.push(ch);
  }

  if (working.length === 0) {
    return errors.ErrKeyEmpty;
  }
  if (working.length > constants.MaxKeyLen) {
    return errors.ErrKeyTooLong;
  }

  return checkName(working.join(""));
}

export { checkKey, mustCheckKey };
