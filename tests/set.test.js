import { set } from '../src';

describe("set tests", () => {
  it("1. Adding prop in existing path", () => {
    const state = set({
      test: {
        testing: 4
      },
      chat: {
        creative: {
          channel: 1234
        }
      }
    }, 'chat.creative.channelSid', 5678, {
      create: true
    });
    return expect(state).toEqual({
      test: {
        testing: 4
      },
      chat: {
        creative: {
          channel: 1234,
          channelSid: 5678
        }
      }
    });
  });

  it("2. Adding prop in non-existent path", () => {
    const state = set({
      test: {
        testing: 4
      }
    }, 'chat.creative.channelSid', 5678, {
      create: true
    });
    return expect(state).toEqual({
      test: {
        testing: 4
      },
      chat: {
        creative: {
          channelSid: 5678
        }
      }
    });
  });
});