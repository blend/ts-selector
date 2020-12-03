"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Any is a no-op node that always matches.
class AnyNode {
    // eslint-disable-next-line @typescript-eslint/no-unusd-vars
    matches(labels) {
        return true;
    }
    validate() {
        return null;
    }
    string() {
        return "";
    }
}
exports.default = AnyNode;
//# sourceMappingURL=any_node.js.map