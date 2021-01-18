import { isNull, isUndefined, isFunction, isString, isValidString, isObjectLike, isObject, isPlainObject } from "../src";

describe("Type check tests", () => {
  // isNull tests
  it("isNull should return true if passed value is null", () => expect(isNull(null)).toEqual(true));
  it("isNull should return false if passed value is not null", () => expect(isNull("null")).toEqual(false));

  // isUndefined tests
  it("isUndefined should return true if passed value is undefined", () => expect(isUndefined(undefined)).toEqual(true));
  it("isUndefined should return false if passed value is not undefined", () => expect(isUndefined("undefined")).toEqual(false));

  // isFunction tests
  it("isFunction should return true if passed value is function", () => expect(isFunction(Math.max)).toEqual(true));
  it("isFunction should return false if passed value is not a function", () => expect(isFunction({})).toEqual(false));

  // isString tests
  it("isString should return true if passed value is a string", () => expect(isString("")).toEqual(true));
  it("isString should return false if passed value is not a string", () => expect(isString({})).toEqual(false));

  // isValidString tests
  it("isValidString should return true if passed value is a string of length > 0", () => expect(isValidString("ad")).toEqual(true));
  it("isValidString should return false if passed value is not a string", () => expect(isValidString({})).toEqual(false));
  it("isValidString should return false if passed value is an empty string", () => expect(isValidString("")).toEqual(false));

  // isObjectLike tests
  it("isObjectLike should return true if passed value is a JSON object", () => expect(isObjectLike({})).toEqual(true));
  it("isObjectLike should return true if passed value is a Date object", () => expect(isObjectLike(new Date())).toEqual(true));
  it("isObjectLike should return false if passed value is null", () => expect(isObjectLike(null)).toEqual(false));
  it("isObjectLike should return false if passed value is a string", () => expect(isObjectLike("")).toEqual(false));

  // isObject tests
  it("isObject should return true if passed value is a JSON object", () => expect(isObject({})).toEqual(true));
  it("isObject should return true if passed value is a Date object", () => expect(isObject(new Date())).toEqual(true));
  it("isObject should return true if passed value is a function", () => expect(isObject(Math.max)).toEqual(true));
  it("isObject should return false if passed value is null", () => expect(isObject(null)).toEqual(false));
  it("isObject should return false if passed value is a string", () => expect(isObject("")).toEqual(false));

  // isPlainObject tests
  it("isPlainObject should return true if passed value is a JSON object", () => expect(isPlainObject({})).toEqual(true));
  it("isPlainObject should return false if passed value is an array", () => expect(isPlainObject([])).toEqual(false));
  it("isPlainObject should return false if passed value is a Date object", () => expect(isPlainObject(new Date())).toEqual(false));
  it("isPlainObject should return false if passed value is a function", () => expect(isPlainObject(Math.max)).toEqual(false));
  it("isPlainObject should return false if passed value is null", () => expect(isPlainObject(null)).toEqual(false));
  it("isPlainObject should return false if passed value is a string", () => expect(isPlainObject("")).toEqual(false));
});
