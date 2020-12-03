"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// And is a combination selector.
class AndNode {
    constructor(children) {
        this.children = children;
    }
    // matches returns if both A and B match the labels.
    matches(labels) {
        for (const s of this.children) {
            if (!s.matches(labels)) {
                return false;
            }
        }
        return true;
    }
    // validate validates all the selectors in the clause.
    validate() {
        for (const s of this.children) {
            const err = s.validate();
            if (err) {
                return err;
            }
        }
        return null;
    }
    // And returns a string representation for the selector.
    string() {
        const childValues = [];
        for (const s of this.children) {
            childValues.push(s.string());
        }
        return childValues.join(", ");
    }
}
exports.default = AndNode;
//# sourceMappingURL=and_node.js.map