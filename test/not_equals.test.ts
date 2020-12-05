import test from "ava";
import * as selector from "../src";

test("assert not equals node validation fails on bad key", async (t) => {
  const notEqualsNode = new selector.NotEquals("_bad", "foo");
  t.truthy(notEqualsNode.validate());
});

test("assert not equals node validation fails on bad value", async (t) => {
  const notEqualsNode = new selector.NotEquals("bad", "_foo");
  t.truthy(notEqualsNode.validate());
});

test("assert not equals node matches on not present", async (t) => {
  const notEqualsNode = new selector.NotEquals("foo", "bar");
  t.true(notEqualsNode.matches({ moo: "loo" }));
});
