"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_key_1 = require("./check_key");
const check_value_1 = require("./check_value");
// In returns if a key matches a set of values.
class InNode {
    constructor(key, values) {
        this.key = key;
        this.values = values;
    }
    matches(labels) {
        // if the labels has a given key
        if (labels.has(this.key)) {
            const value = labels.get(this.key);
            // for each selector value
            for (const iv of this.values) {
                // if they match, return true
                if (iv === value) {
                    return true;
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
exports.default = InNode;
//# sourceMappingURL=in_node.js.map