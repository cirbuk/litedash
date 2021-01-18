import { pipeline } from "../src";

const functions = [(val) => `${val}:pipe1`, (val) => `${val}:pipe2`, (val) => `${val}:pipe3`];

describe("pipeline tests", () => {
  it("Should return expected value with default value", () => expect(pipeline(functions, "default")()).toEqual("default:pipe1:pipe2:pipe3"));

  it("Should return expected value with proper value", () => expect(pipeline(functions, "default")("nondefault")).toEqual("nondefault:pipe1:pipe2:pipe3"));
});
