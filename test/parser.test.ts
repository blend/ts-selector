import test from "ava";
import * as selector from "../src";

test("assert parser empty input", async (t) => {
  const sel = new selector.Parser("").mustParse();
  t.deepEqual("", sel.string());

  t.true(sel.matches({ foo: "bar" }));
  t.true(sel.matches({ foo: "not-bar" }));
});

test("assert parser equal is correct", async (t) => {
  const sel = new selector.Parser("foo == bar").mustParse();
  t.deepEqual("foo == bar", sel.string());

  t.true(sel.matches({ foo: "bar" }));
  t.false(sel.matches({ foo: "not-bar" }));
});

test("assert parser not equal is correct", async (t) => {
  const sel = new selector.Parser("foo != bar").mustParse();
  t.deepEqual("foo != bar", sel.string());

  t.false(sel.matches({ foo: "bar" }));
  t.true(sel.matches({ foo: "not-bar" }));
});

test("assert parser in is correct", async (t) => {
  const sel = new selector.Parser("foo in (bar, buzz)").mustParse();
  t.deepEqual("foo in (bar, buzz)", sel.string());

  t.true(sel.matches({ foo: "bar" }));
  t.true(sel.matches({ foo: "buzz" }));
  t.false(sel.matches({ foo: "not-bar" }));
  t.false(sel.matches({ loo: "bar" }));
});

test("assert parser not in is correct", async (t) => {
  const sel = new selector.Parser("foo notin (bar, buzz)").mustParse();
  t.deepEqual("foo notin (bar, buzz)", sel.string());

  t.false(sel.matches({ foo: "bar" }));
  t.false(sel.matches({ foo: "buzz" }));
  t.true(sel.matches({ foo: "not-bar" }));
  t.true(sel.matches({ loo: "bar" }));
});

test("assert parser has key is correct", async (t) => {
  const sel = new selector.Parser("foo").mustParse();
  t.deepEqual("foo", sel.string());

  t.true(sel.matches({ foo: "bar" }));
  t.true(sel.matches({ foo: "buzz" }));
  t.false(sel.matches({ loo: "bar" }));
  t.false(sel.matches({ loo: "buzz" }));
});

test("assert parser not has key is correct", async (t) => {
  const sel = new selector.Parser("!foo").mustParse();
  t.deepEqual("!foo", sel.string());

  t.false(sel.matches({ foo: "bar" }));
  t.false(sel.matches({ foo: "buzz" }));
  t.true(sel.matches({ loo: "bar" }));
  t.true(sel.matches({ loo: "buzz" }));
});

test("assert parser handles and conditions", async (t) => {
  const sel = new selector.Parser("foo in (bar, buzz), moo == loo").mustParse();
  t.deepEqual("foo in (bar, buzz), moo == loo", sel.string());

  t.true(sel.matches({ foo: "bar", moo: "loo" }));
  t.true(sel.matches({ foo: "buzz", moo: "loo" }));
  t.false(sel.matches({ foo: "bar", moo: "not-loo" }));
  t.false(sel.matches({ foo: "buzz", moo: "not-loo" }));
  t.false(sel.matches({ foo: "not-bar" }));
});

test("assert parser handles README.md example", async (t) => {
  const sel = new selector.Parser("x in (foo,,baz),y,z notin ()").mustParse();
  t.deepEqual("x in (foo, baz), y, z notin ()", sel.string());

  t.true(sel.matches({ x: "foo", y: "something", z: "loo" }));
  t.true(sel.matches({ x: "baz", y: "something", z: "loo" }));
  t.false(sel.matches({ x: "who", y: "something", z: "loo" }));
  t.false(sel.matches({ x: "baz", z: "loo" }));
});
