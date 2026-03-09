import { describe, expect, test } from "vitest";
import { toPrimitive } from "./toPrimitive";

const objWithToPrim = {
  [Symbol.toPrimitive]: (hint: string) => {
    if (hint === "number") {
      return Number(this);
    }
    if (hint === "default") {
      return "returning default";
    }
    return `${this}`;
  },
};

const tests = [
  [1, , 1],
  ["Hallo", , "Hallo"],
  [true, , true],
  [[1], , "1"],
  [[1, 2], , "1,2"],
  [objWithToPrim, , "returning default"],
  [objWithToPrim, "number", NaN],
  [objWithToPrim, "string", "[object global]"],
] as const;

describe("toPrimitive", () => {
  test.each(tests)(
    "toPrimitive(%s, %s) -> %s",
    (val, preferredType, expected) => {
      expect(toPrimitive(val, preferredType)).toBe(expected);
    },
  );
});
