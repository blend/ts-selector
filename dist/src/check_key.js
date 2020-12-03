"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKey = void 0;
const constants = require("./constants");
const errors = require("./errors");
const check_dns_1 = require("./check_dns");
const check_name_1 = require("./check_name");
function checkKey(key) {
    const keyLen = key.length;
    if (keyLen === 0) {
        return errors.ErrKeyEmpty;
    }
    if (keyLen > constants.MaxKeyTotalLen) {
        return errors.ErrKeyTooLong;
    }
    let working = [];
    let state = 0;
    let ch = "";
    let err = null;
    for (let pos = 0; pos < keyLen; pos++) {
        ch = key.charAt(pos);
        if (state == 0) {
            if (ch === constants.ForwardSlash) {
                err = check_dns_1.checkDNS(working.join(""));
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
    return check_name_1.checkName(working.join(""));
}
exports.checkKey = checkKey;
//# sourceMappingURL=check_key.js.map