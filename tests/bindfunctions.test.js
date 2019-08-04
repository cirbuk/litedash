import { bindFunctions } from "../src";

describe("mapValues tests", () => {
  let boundFunctions = {};
  beforeEach(() => {
    const fn = (pre1, pre2, arg1, arg2, post1) => ({
      pre1, pre2, arg1, arg2, post1
    });
    boundFunctions = bindFunctions({
      fn1: fn,
      fn2: fn
    }, [1, { val: 1 }], ["test", true]);
  });

  it("should throw error when object in undefined", () => expect(() => bindFunctions()).toThrow("Unable to extract keys from provided object"));

  it("should return values from bound function1", () =>
    expect(boundFunctions.fn1(1, 2)).toEqual({
      pre1: 1,
      pre2: {
        val: 1
      },
      arg1: 1,
      arg2: 2,
      post1: "test"
    }));

  it("should return values from bound function2", () =>
    expect(boundFunctions.fn2(1, 2, 3)).toEqual({
      pre1: 1,
      pre2: {
        val: 1
      },
      arg1: 1,
      arg2: 2,
      post1: 3
    }));
});