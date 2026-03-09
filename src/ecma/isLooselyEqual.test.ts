import { isLooselyEqual } from "./isLooselyEqual";
import { describe, expect, test } from "vitest";

const tests = [
  [1, 2, false],
  ["1", "1", true],
  [{}, {}, false],
  ["{}", "{}", true],
  [undefined, undefined, true],
  [null, null, true],
  [null, undefined, true],
  [undefined, null, true],
  [1, "1", true],
  ["1", 1, true],
  [BigInt(0), "x", false],
  [BigInt(4), "4", true],
  ["4", BigInt(4), true],
  ["x", BigInt(0), false],
  [true, 1, true],
  [true, 2, false],
  [BigInt(1), 1, true],
  [1, BigInt(1), true],
  [NaN, NaN, false],
  [null, false, false],
  [0, false, true],
  [[], false, true],
] as const;

describe("isLooselyEqual", () => {
  test.each(tests)("equals(%o, %o) -> %s", (val1, val2, expected) => {
    expect(isLooselyEqual(val1, val2)).toBe(expected);
  });
});
