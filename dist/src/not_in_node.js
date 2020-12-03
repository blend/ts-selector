"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_key_1 = require("./check_key");
const check_value_1 = require("./check_value");
// In returns if a key matches a set of values.
class NotInNode {
    constructor(key, values) {
        this.key = key;
        this.values = values;
    }
    matches(labels) {
        // if the labels has a given key
        if (labels[this.key] !== undefined) {
            const value = labels[this.key];
            // for each selector value
            for (const iv of this.values) {
                // if they match, return true
                if (iv === value) {
                    return false;
                }
            }
        }
        return true;
    }
    validate() {
        let err = check_key_1.checkKey(this.key);
        if (err) {
            return err;
        }
        for (const iv of this.values) {
            err = check_value_1.checkValue(iv);
            if (err) {
                return err;
            }
        }
        return null;
    }
    string() {
        return `${this.key} in (${this.values.join(", ")})`;
    }
}
exports.default = NotInNode;
//# sourceMappingURL=not_in_node.js.map