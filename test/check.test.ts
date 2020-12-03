import test from "ava";
import * as selector from "../src";

test("assert check labels works as intended", async (t) => {
  const goodLabels = { foo: "bar", "foo.com/bar": "baz" };
  t.falsy(selector.checkLabels(goodLabels));
  const badLabels = { foo: "bar", "_foo.com/bar": "baz" };
  t.truthy(selector.checkLabels(badLabels));
});

test("assert check key works on specific problems", async (t) => {
  t.falsy(selector.checkKey("1-num.2-num/3-num"));
});

test("assert check key passes the k8s test suite", async (t) => {
  const values: string[] = [
    // the "good" cases
    "simple",
    "now-with-dashes",
    "1-starts-with-num",
    "1234",
    "simple/simple",
    "now-with-dashes/simple",
    "now-with-dashes/now-with-dashes",
    "now.with.dots/simple",
    "now-with.dashes-and.dots/simple",
    "1-num.2-num/3-num",
    "1234/5678",
    "1.2.3.4/5678",
    "Uppercase_Is_OK_123",
    "example.com/Uppercase_Is_OK_123",
    "requests.storage-foo",
    "a".repeat(63),
    "a".repeat(253) + "/" + "b".repeat(63),
  ];
  const badValues: string[] = [
    // the "bad" cases
    "nospecialchars%^=@",
    "cantendwithadash-",
    "-cantstartwithadash-",
    "only/one/slash",
    "Example.com/abc",
    "example_com/abc",
    "example.com/",
    "/simple",
    "a".repeat(64),
    "a".repeat(254) + "/abc",
  ];

  for (const val of values) {
    t.falsy(selector.checkKey(val), `failed value: ${val}`);
  }
  for (const val of badValues) {
    t.truthy(selector.checkKey(val));
  }
});

test("assert check key passes go-sdk/selector suite", async (t) => {
  t.falsy(selector.checkKey("foo"));
  t.falsy(selector.checkKey("bar/foo"));
  t.falsy(selector.checkKey("bar.io/foo"));
  t.truthy(selector.checkKey("_foo"));
  t.truthy(selector.checkKey("-foo"));
  t.truthy(selector.checkKey("foo-"));
  t.truthy(selector.checkKey("foo_"));
  t.truthy(selector.checkKey("bar/foo/baz"));

  t.truthy(selector.checkKey(""), "should error on empty keys");
  t.truthy(selector.checkKey("/foo"), "should error on empty dns prefixes");

  let superLongDNSPrefixed = `${"a".repeat(
    selector.MaxDNSPrefixLen
  )}/${"a".repeat(selector.MaxKeyLen)}`;
  t.falsy(selector.checkKey(superLongDNSPrefixed));

  superLongDNSPrefixed = `${"a".repeat(
    selector.MaxDNSPrefixLen + 1
  )}/${"a".repeat(selector.MaxKeyLen)}`;
  t.truthy(selector.checkKey(superLongDNSPrefixed));
  superLongDNSPrefixed = `${"a".repeat(
    selector.MaxDNSPrefixLen + 1
  )}/${"a".repeat(selector.MaxKeyLen + 1)}`;
  t.truthy(selector.checkKey(superLongDNSPrefixed));
  superLongDNSPrefixed = `${"a".repeat(selector.MaxDNSPrefixLen)}/${"a".repeat(
    selector.MaxKeyLen + 1
  )}`;
  t.truthy(selector.checkKey(superLongDNSPrefixed));
});
