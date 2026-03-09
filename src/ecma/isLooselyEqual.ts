import { isEcmaObjectType } from "./isEcmaObjectType";
import { toPrimitive } from "./toPrimitive";

// Shortcut of https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtobigint
const toBigInt = (x: string): BigInt | undefined => {
  try {
    return BigInt(x);
  } catch (e) {
    return undefined;
  }
};

// https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islooselyequal
export const isLooselyEqual = (x: unknown, y: unknown): boolean => {
  if (typeof x === typeof y) {
    return x === y;
  }

  if (x === null && typeof y === "undefined") {
    return true;
  }

  if (typeof x === "undefined" && y === null) {
    return true;
  }

  // ignore [[IsHTMLDDA]] Internal Slot for now

  if (typeof x === "number" && typeof y === "string") {
    return isLooselyEqual(x, Number(y));
  }

  if (typeof x === "string" && typeof y === "number") {
    return isLooselyEqual(Number(x), y);
  }

  if (typeof x === "bigint" && typeof y === "string") {
    const n = toBigInt(y);
    if (typeof n === "undefined") {
      return false;
    }

    return isLooselyEqual(x, n);
  }

  if (typeof x === "string" && typeof y === "bigint") {
    return isLooselyEqual(y, x);
  }

  if (typeof x === "boolean") {
    return isLooselyEqual(Number(x), y);
  }

  if (typeof y === "boolean") {
    return isLooselyEqual(x, Number(y));
  }

  if (
    new Set(["string", "number", "bigint", "symbol"]).has(typeof x) &&
    isEcmaObjectType(y)
  ) {
    return isLooselyEqual(x, toPrimitive(y));
  }

  if (
    isEcmaObjectType(x) &&
    new Set(["string", "number", "bigint", "symbol"]).has(typeof y)
  ) {
    return isLooselyEqual(toPrimitive(x), y);
  }

  if (
    (typeof x === "bigint" && typeof y === "number") ||
    (typeof x === "number" && typeof y === "bigint")
  ) {
    if (
      (typeof x === "number" && !isFinite(x)) ||
      (typeof y === "number" && !isFinite(y))
    ) {
      // bigint cannot be infinite
      return false;
    }

    if (BigInt(x) === BigInt(y)) {
      // Workaround for: If ℝ(x) = ℝ(y), return true.
      return true;
    }

    return false;
  }

  return false;
};
