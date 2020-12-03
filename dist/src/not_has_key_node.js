"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_key_1 = require("./check_key");
// HasKey returns if a label set has a given key.
class NotHasKeyNode {
    constructor(key) {
        this.key = key;
    }
    matches(labels) {
        if (!labels) {
            return false;
        }
        return !labels.has(this.key);
    }
    validate() {
        return check_key_1.checkKey(this.key);
    }
    string() {
        return this.key;
    }
}
exports.default = NotHasKeyNode;
//# sourceMappingURL=not_has_key_node.js.map