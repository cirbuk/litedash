import { capitalize } from "../src";

describe("capitalize tests", () => {
  it("should return empty string for undefined", () => expect(capitalize(undefined)).toEqual(""));

  it("should return empty string for null", () => expect(capitalize(null)).toEqual(""));

  it("should capitalize non-capitalized string", () => expect(capitalize("test")).toEqual("Test"));

  it("should return capitalized string without any changes", () => expect(capitalize("Test")).toEqual("Test"));
});