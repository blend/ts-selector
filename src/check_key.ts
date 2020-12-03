import * as constants from "./constants";
import * as errors from "./errors";
import { checkDNS } from "./check_dns";
import { checkName } from "./check_name";

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
    if (state == 0) {
      if (ch === constants.ForwardSlash) {
        err = checkDNS(working.join(""));
        if (err !== null) {
          return err;
        }
        working = [];
        state = 1;
        continue;
      }
    }
    working.push(ch);
    continue;
  }

  if (working.length === 0) {
    return errors.ErrKeyEmpty;
  }
  if (working.length > constants.MaxKeyLen) {
    return errors.ErrKeyTooLong;
  }

  return checkName(working.join(""));
}

export { checkKey };
