import * as constants from "./constants";
import * as errors from "./errors";
import * as charUtil from "./char_util";

function checkDNS(value: string): Error | null {
  const valueLen = value.length;
  if (valueLen == 0) {
    return errors.ErrKeyDNSPrefixEmpty;
  }
  if (valueLen > constants.MaxDNSPrefixLen) {
    return errors.ErrKeyDNSPrefixTooLong;
  }
  let state = 0;
  let ch = "";
  for (let pos = 0; pos < valueLen; pos++) {
    ch = value.charAt(pos);
    switch (state) {
      case 0: //check prefix | suffix
        if (!charUtil.isLowerAlpha(ch)) {
          return errors.ErrKeyInvalidCharacter;
        }
        state = 1;
        continue;
      case 1:
        if (ch === constants.Underscore) {
          return errors.ErrKeyInvalidCharacter;
        }
        if (charUtil.isNameSymbol(ch)) {
          state = 2;
          continue;
        }
        if (!charUtil.isLowerAlpha(ch)) {
          return errors.ErrKeyInvalidCharacter;
        }
        if (pos === valueLen - 2) {
          state = 0;
        }
        continue;
      case 2: // we've hit a dot, dash, or underscore that can't repeat
        if (!charUtil.isLowerAlpha(ch)) {
          return errors.ErrKeyInvalidCharacter;
        }
        if (pos == valueLen - 2) {
          state = 0;
          continue;
        }
        state = 1;
    }
  }
  return null;
}

export { checkDNS };
