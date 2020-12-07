import test from "ava";
import { checkDNS } from "../src/check_dns";

test("assert check dns works as intended", async (t) => {
  const invalidInputs = [
    "",
    "INVALID",
    "Invalid",
    "Invalid.com/test",
    "invalid!",
    "!invalid",
    "inval!d",
    "-prefix",
    "suffix-",
    ".dots",
    "dots.",
    "dots..dots",
    "dots-.dots",
    "dots.-dots",
    "dots-.-dots",
    "dots-.-dots",
  ];
  for (let input of invalidInputs) {
    t.truthy(checkDNS(input), `input: ${input}`);
  }

  const validInputs = [
    "foo",
    "foo.bar",
    "foo-bar.moo",
    "foo-bar.moo-bar",
    "foo-bar.moo-bar",
  ];

  for (let input of validInputs) {
    t.falsy(checkDNS(input), `input: ${input}`);
  }
});
