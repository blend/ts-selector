"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkName = void 0;
const constants = require("./constants");
const errors = require("./errors");
const charUtil = require("./char_util");
function checkName(value) {
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
                if (!(charUtil.isNameSymbol(ch) ||
                    ch === constants.BackSlash ||
                    charUtil.isAlpha(ch))) {
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
exports.checkName = checkName;
//# sourceMappingURL=check_name.js.map