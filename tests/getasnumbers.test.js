import { getAsNumbers } from "../src";

describe("getAsNumbers tests", () => {
  it("Should return extracted values as numbers", () =>
    expect(
      getAsNumbers(
        {
          size: {
            h: "10",
            w: "-10",
          },
          position: {
            x: 100,
            y: 400.5,
          },
        },
        ["position.x", "size.h", "test.haha"],
        [undefined, undefined, 30]
      )
    ).toEqual([100, 10, 30]));

  it("Should return extracted values as such if NaNs found", () =>
    expect(
      getAsNumbers(
        {
          size: {
            h: "10",
            w: "-10",
            type: "max",
          },
          position: {
            x: 100,
            y: 400.5,
          },
        },
        ["position.x", "size.h", "test.haha", "size.type"],
        [undefined, undefined, 30]
      )
    ).toEqual([100, 10, 30, "max"]));
});
