"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_key_1 = require("./check_key");
const check_value_1 = require("./check_value");
// NotEqualsNode returns if a key strictly does not equals a value.
class NotEqualsNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    matches(labels) {
        if (labels.has(this.key)) {
            return labels.get(this.key) !== this.value;
        }
        return true;
    }
    validate() {
        let err = check_key_1.checkKey(this.key);
        if (err) {
            return err;
        }
        err = check_value_1.checkValue(this.value);
        return err;
    }
    string() {
        return `${this.key} != ${this.value}`;
    }
}
exports.default = NotEqualsNode;
//# sourceMappingURL=not_equals_node.js.map