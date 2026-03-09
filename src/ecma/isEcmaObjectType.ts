/**
 * Checks whether the type of $x is object and it is not null.
 *
 * In the specs, null is it's own type, not object
 * https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-null-type
 **/
export const isEcmaObjectType = (x: unknown): x is Object => {
  return typeof x === "object" && x !== null;
};
