import { mapValues } from "../src";

describe("mapValues tests", () => {
  it("should throw error when object in undefined", () => expect(() => mapValues()).toThrow("Unable to extract keys from provided object"));

  it("should map values", () => {
    const results = mapValues(
      {
        test: 1,
        blast: 2,
      },
      (value, key) => key
    );
    return expect(results).toEqual({
      test: "test",
      blast: "blast",
    });
  });
});
