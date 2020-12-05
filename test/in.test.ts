import test from "ava";
import * as selector from "../src";

test("assert in node validation fails on bad key", async (t) => {
  const inNode = new selector.In("_bad", ["foo", "bar"]);
  t.truthy(inNode.validate());
});

test("assert in node validation fails on bad value", async (t) => {
  const inNode = new selector.In("bad", ["foo", "_bar"]);
  t.truthy(inNode.validate());
});
