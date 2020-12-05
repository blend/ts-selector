import test from "ava";
import * as selector from "../src";

test("assert not has key node validation fails on bad key", async (t) => {
  const notHasKeyNode = new selector.NotHasKey("_bad");
  t.truthy(notHasKeyNode.validate());
});
