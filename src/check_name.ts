import * as errors from "./errors";
import * as charUtil from "./char_util";

function checkName(value: string): Error | null {
  const valueLen = value.length;
  let state = 0;
  let ch = "";
  for (let pos = 0; pos < valueLen; pos++) {
    ch = value.charAt(pos);
    switch (state) {
      case 0: //check prefix/suffix
        if (!charUtil.isAlpha(ch)) {
          return errors.ErrKeyInvalidCharacter;
        }
        state = 1;
        continue;
      case 1:
        if (!(charUtil.isNameSymbol(ch) || charUtil.isAlpha(ch))) {
          return errors.ErrKeyInvalidCharacter;
        }
        if (pos === valueLen - 2) {
          state = 0;
        }
        continue;
    }
  }
  return null;
}

export { checkName };
