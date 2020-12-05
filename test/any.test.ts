import test from "ava";
import * as selector from "../src";

test("assert any works as intended", async (t) => {
  const any = new selector.Any();
  t.true(any.matches({ foo: "bar" }));
  t.falsy(any.validate());
  t.deepEqual("", any.string());
});
