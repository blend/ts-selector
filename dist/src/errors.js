"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrKeyInvalidCharacter = exports.ErrValueTooLong = exports.ErrKeyDNSPrefixTooLong = exports.ErrKeyDNSPrefixEmpty = exports.ErrKeyTooLong = exports.ErrKeyEmpty = exports.ErrInvalidSelector = exports.ErrInvalidOperator = void 0;
exports.ErrInvalidOperator = Error("invalid operator");
exports.ErrInvalidSelector = Error("invalid selector");
exports.ErrKeyEmpty = Error("key empty");
exports.ErrKeyTooLong = Error("key too long");
exports.ErrKeyDNSPrefixEmpty = Error("key dns prefix empty");
exports.ErrKeyDNSPrefixTooLong = Error("key dns prefix too long; must be less than 253 characters");
exports.ErrValueTooLong = Error("value too long; must be less than 63 characters");
exports.ErrKeyInvalidCharacter = Error(`key contains invalid characters, regex used: ([A-Za-z0-9_-\\.])`);
//# sourceMappingURL=errors.js.map