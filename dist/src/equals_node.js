"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_key_1 = require("./check_key");
const check_value_1 = require("./check_value");
// Equals returns if a key strictly equals a value.
class EqualsNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    matches(labels) {
        if (labels[this.key] !== undefined) {
            return labels[this.key] === this.value;
        }
        return false;
    }
    validate() {
        var err = check_key_1.checkKey(this.key);
        if (err) {
            return err;
        }
        err = check_value_1.checkValue(this.value);
        return err;
    }
    string() {
        return `${this.key} == ${this.value}`;
    }
}
exports.default = EqualsNode;
//# sourceMappingURL=equals_node.js.map