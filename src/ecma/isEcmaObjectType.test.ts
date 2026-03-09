import { describe, expect, test } from "vitest";
import { isEcmaObjectType } from "./isEcmaObjectType";

describe("isEcmaObjectType", () => {
  test.each([
    [{}, true],
    [[], true],
    [null, false],
    ["123", false],
  ])("isEcmaObjectType(%s) -> %s", (val, expected) => {
    expect(isEcmaObjectType(val)).toBe(expected);
  });
});
