import test from "ava";
import * as selector from "../src";

test("assert parse handles README.md example", async (t) => {
  const sel = selector.parse("x in (foo,,baz),y,z notin ()");
  t.false(sel instanceof Error);

  const typedSel: ISelector = sel as ISelector;
  t.deepEqual("x in (foo, baz), y, z notin ()", typedSel.string());

  t.true(typedSel.matches({ x: "foo", y: "something", z: "loo" }));
  t.true(typedSel.matches({ x: "baz", y: "something", z: "loo" }));
  t.false(typedSel.matches({ x: "who", y: "something", z: "loo" }));
  t.false(typedSel.matches({ x: "baz", z: "loo" }));
});

test("assert mustParse handles README.md example", async (t) => {
  const sel = selector.mustParse("x in (foo,,baz),y,z notin ()");
  t.deepEqual("x in (foo, baz), y, z notin ()", sel.string());

  t.true(sel.matches({ x: "foo", y: "something", z: "loo" }));
  t.true(sel.matches({ x: "baz", y: "something", z: "loo" }));
  t.false(sel.matches({ x: "who", y: "something", z: "loo" }));
  t.false(sel.matches({ x: "baz", z: "loo" }));
});

test("assert mustParse handles domain example", async (t) => {
  const sel = selector.mustParse("example.com/failure-domain == primary");
  t.deepEqual("example.com/failure-domain == primary", sel.string());

  t.true(
    sel.matches({
      bar: "foo",
      "example.com/failure-domain": "primary",
      foo: "bar",
    })
  );
  t.false(sel.matches({ x: "baz", y: "something", z: "loo" }));
  t.false(sel.matches({ x: "who", y: "something", z: "loo" }));
  t.false(sel.matches({ x: "baz", z: "loo" }));
});
