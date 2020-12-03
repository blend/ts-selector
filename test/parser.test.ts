import test from "ava";
import * as selector from "../src";

test("assert parser equal is correct", async (t) => {
  const sel = new selector.Parser("foo == bar").mustParse();
  t.deepEqual("foo == bar", sel.string());

  t.true(sel.matches({ foo: "bar" }));
  t.false(sel.matches({ foo: "not-bar" }));
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
  t.deepEqual("foo in (bar, buzz)", sel.string());

  t.false(sel.matches({ foo: "bar" }));
  t.false(sel.matches({ foo: "buzz" }));
  t.true(sel.matches({ foo: "not-bar" }));
  t.true(sel.matches({ loo: "bar" }));
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
