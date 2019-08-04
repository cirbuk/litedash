import { get } from '../src';

describe("get tests", () => {
  it("Gets value from path", () => {
    const state = get({
      test: {
        testing: 4
      },
      chat: {
        creative: {
          channel: 1234
        }
      }
    }, 'chat.creative');
    return expect(state).toEqual({
      channel: 1234
    });
  });

  it("Gets undefined from non-existent path", () => {
    const state = get({
      test: {
        testing: 4
      }
    }, 'chat.creative.channelSid');
    return expect(state).toEqual(undefined);
  });

  it("Returns defaultValue if provided when path is non-existent", () => {
    const state = get({
      test: {
        testing: 4
      }
    }, 'chat.creative.channelSid', 5432);
    return expect(state).toEqual(5432);
  });
});