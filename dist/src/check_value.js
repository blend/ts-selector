"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValue = void 0;
const constants = require("./constants");
const errors = require("./errors");
const check_name_1 = require("./check_name");
// checkValue returns if the value is valid.
function checkValue(value) {
    if (value.length > constants.MaxValueLen) {
        return errors.ErrValueTooLong;
    }
    return check_name_1.checkName(value);
}
exports.checkValue = checkValue;
//# sourceMappingURL=check_value.js.map