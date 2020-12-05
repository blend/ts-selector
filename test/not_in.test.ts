import test from "ava";
import * as selector from "../src";

test("assert not in node validation fails on bad key", async (t) => {
  const notInNode = new selector.NotIn("_bad", ["foo", "bar"]);
  t.truthy(notInNode.validate());
});

test("assert not in node validation fails on bad value", async (t) => {
  const notInNode = new selector.NotIn("bad", ["foo", "_bar"]);
  t.truthy(notInNode.validate());
});
