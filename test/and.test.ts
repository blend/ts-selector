import test from "ava";
import * as selector from "../src";

test("assert and node works as intended", async (t) => {
  const andNode = new selector.And([
    new selector.Equals("foo", "bar"),
    new selector.Equals("moo", "loo"),
  ]);
  t.falsy(andNode.validate());
  t.deepEqual("foo == bar, moo == loo", andNode.string());

  t.true(andNode.matches({ foo: "bar", moo: "loo" }));
  t.false(andNode.matches({ who: "bar", moo: "loo" }));
  t.false(andNode.matches({ foo: "not-bar", moo: "loo" }));
  t.false(andNode.matches({ foo: "bar", moo: "not-loo" }));
  t.false(andNode.matches({ foo: "not-bar", moo: "not-loo" }));
});

test("assert and node validation fails", async (t) => {
  const andNode = new selector.And([
    new selector.Equals("_foo", "bar"),
    new selector.Equals("moo", "loo"),
  ]);
  t.truthy(andNode.validate());
});
