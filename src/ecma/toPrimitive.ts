import { isEcmaObjectType } from "./isEcmaObjectType";

/**
 * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ordinarytoprimitive
 */
const ordinaryToPrimitive = (o: object | null, hint: string) => {
  const methodNames: string[] = [];
  if (hint === "string") {
    methodNames.push("toString", "valueOf");
  } else {
    methodNames.push("valueOf", "toString");
  }

  for (const name of methodNames) {
    const method = o?.[name] as Function | undefined;
    if (method?.call) {
      const result = method.call(o);
      if (!isEcmaObjectType(result)) {
        return result;
      }
    }
  }

  throw new TypeError(
    `Could not convert ordinary ${JSON.stringify(o)} to a primitive`,
  );
};

/**
 * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive
 */
export const toPrimitive = (x: unknown, preferredType?: string) => {
  if (!isEcmaObjectType(x)) {
    // In the specs, null is it's own type, not object
    // https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-null-type
    return x;
  }

  const exoticToPrim = x?.[Symbol.toPrimitive];
  if (exoticToPrim) {
    let hint = "number";
    if (!preferredType) {
      hint = "default";
    }
    if (preferredType === "string") {
      hint = "string";
    }
    const result = exoticToPrim.call(x, hint);
    if (typeof !isEcmaObjectType(result)) {
      return result;
    }

    throw TypeError(`Could not convert ${JSON.stringify(x)} to a primitive`);
  }

  if (!preferredType) {
    preferredType = "number";
  }

  return ordinaryToPrimitive(x, preferredType);
};
