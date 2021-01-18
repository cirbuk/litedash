import { filterObject } from "../src";

const object = {
  one: 1,
  two: 2,
};

describe("filterObject tests", () => {
  it("Should return same object", () => expect(filterObject(object, () => true)).toEqual(object));

  it("Should return filtered object based on value filter", () => expect(filterObject(object, (value) => value < 0)).toEqual({}));

  it("Should return filtered object based on key filter", () =>
    expect(filterObject(object, (value, key) => key === "two")).toEqual({
      two: 2,
    }));
});
