export const ErrInvalidOperator = Error("invalid operator");
export const ErrInvalidSelector = Error("invalid selector");
export const ErrKeyEmpty = Error("key empty");
export const ErrKeyTooLong = Error("key too long");
export const ErrKeyDNSPrefixEmpty = Error("key dns prefix empty");
export const ErrKeyDNSPrefixTooLong = Error(
  "key dns prefix too long; must be less than 253 characters"
);
export const ErrValueTooLong = Error(
  "value too long; must be less than 63 characters"
);
export const ErrKeyInvalidCharacter = Error(
  `key contains invalid characters, regex used: ([A-Za-z0-9_-\\.])`
);
