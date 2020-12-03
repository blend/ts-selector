# ts-selector

`ts-selector` is an implementation of Kubernetes label selectors.

It enables you to parse selectors and match labels (`Record<string,string>`) against them.

The compilation process uses finite state machines and is relatively efficient.

Selectors are compiled as predicate trees such that once you compile the selector it is every fast to evaluate label matches.

## Usage

```typescript
import * as selector from "ts-selector"

const mySelector = "x in (foo,,baz),y,z notin ()";
const sel = selector.New(mySelector).mustParse();

console.log(sel.matches({ x: "foo", y: "bar" });      // prints 'true';
console.log(sel.matches({ x: "baz", y: "bar" });      // prints 'true';
console.log(sel.matches({ x: "not-foo", y: "bar" });  // prints 'false';

// you can also verify labels are conformant

console.log(selector.checkLabels({ x: "foo", y: "bar" })) // prints 'null';
console.log(selector.checkLabels({ "_bad": "foo", y: "bar" })) // prints 'Error: ...';
```

## Selector Grammar

```
Selectors must be in the form:

  <selector-syntax>         ::= <requirement> | <requirement> "," <selector-syntax>
  <requirement>             ::= [!] KEY [ <set-based-restriction> | <exact-match-restriction> ]
  <set-based-restriction>   ::= "" | <inclusion-exclusion> <value-set>
  <inclusion-exclusion>     ::= <inclusion> | <exclusion>
  <exclusion>               ::= "notin"
  <inclusion>               ::= "in"
  <value-set>               ::= "(" <values> ")"
  <values>                  ::= VALUE | VALUE "," <values>
  <exact-match-restriction> ::= ["="|"=="|"!="] VALUE

`KEY` is a sequence of one or more characters following [ DNS_SUBDOMAIN "/" ] DNS*LABEL. Max length is 63 characters.
`VALUE` is a sequence of zero or more characters "([A-Za-z0-9*-\.])". Max length is 63 characters.
Delimiter is white space: (' ', '\t')

Example of valid syntax:

> "x in (foo,,baz),y,z notin ()"

Note:
  (1) Inclusion - " in " - denotes that the KEY exists and is equal to any of the
      VALUEs in its requirement
  (2) Exclusion - " notin " - denotes that the KEY is not equal to any
      of the VALUEs in its requirement or does not exist
  (3) The empty string is a valid VALUE
  (4) A requirement with just a KEY - as in "y" above - denotes that
      the KEY exists and can be any VALUE.
  (5) A requirement with just !KEY requires that the KEY not exist.
```

# License

`ts-events` is licensed under the MIT license.