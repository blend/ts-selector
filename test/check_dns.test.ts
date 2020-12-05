import test from "ava";
import { checkDNS } from "../src/check_dns";

test("assert check dns fails on repeats", async (t) => {
  t.truthy(checkDNS("foo..bar"));
});

test("assert check dns fails non-dns symbols", async (t) => {
  t.truthy(checkDNS("foo!bar"));
});
