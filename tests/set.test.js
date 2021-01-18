import { set } from "../src";

const parameters = {
  product: {
    default: "bags",
    type: "text",
    hide: "true",
    editorMeta: {
      group: "Product",
      order: 2,
    },
  },
  "product-img-axis": {
    default: 0,
    type: "string",
    hideInSheet: true,
    editorMeta: {
      group: "Product",
      min: -90,
      max: 90,
      step: 0.5,
      type: "range",
      order: 9,
    },
    title: "Rotate",
  },
  sticker: {
    default: "drama queen",
    type: "text",
    hide: "true",
    editorMeta: {
      group: "Sticker",
      order: 5,
    },
  },
  "sticker-image": {
    default: "https://lh3.googleusercontent.com/uzPGQBu7C9xLwDfbPyQInouxXQRW428J8g6wLoN7xjXW-EsBh-sf7jY-8uG7IOfYD0uv-wDUlNyg7LmpVvC4Utw",
    type: "image",
    hideInSheet: "true",
    editorMeta: {
      groupDefault: true,
      searchIn: "f87cec2b-07b2-4175-b94b-5832eba9c30f",
      group: "Sticker",
      order: 1,
      tags: ["{{sticker}}"],
    },
    title: "Sticker",
  },
  "sticker-axis": {
    default: -10,
    type: "string",
    hideInSheet: true,
    editorMeta: {
      group: "Sticker",
      min: -90,
      max: 90,
      step: 0.5,
      type: "range",
      order: 9,
    },
    title: "Rotate",
  },
  product_image: {
    default: "https://cdn.shopify.com/s/files/1/0308/7096/2316/products/product-image-824328076.jpg?v=1580189511",
    type: "image",
    hideInSheet: "true",
    editorMeta: {
      suggest: {
        request: {
          url: "{{product_image}}",
          type: "remove_bg",
          size: "preview",
        },
        patch: {
          product_image: "{{url}}",
        },
      },
      group: "Product",
      order: 1,
    },
    title: "Product",
  },
  "sticker-zoom": {
    default: 1.3,
    type: "string",
    hideInSheet: true,
    editorMeta: {
      group: "Sticker",
      min: 0.1,
      max: 10,
      step: 0.1,
      type: "range",
      order: 9,
    },
    title: "Zoom",
  },
  background: {
    default: "#FFFFFF",
    type: "color",
    editorMeta: {
      group: "Background",
      order: 8,
    },
    title: "Background Color",
  },
  "sticker-pos": {
    default: {
      y: 300,
      x: 900,
    },
    type: "object",
    hideInSheet: true,
    editorMeta: {
      group: "Sticker",
      step: 1,
      type: "joystick",
      order: 13,
    },
    title: "Position",
  },
  "product-imgzoom": {
    default: 1,
    type: "string",
    hideInSheet: true,
    editorMeta: {
      group: "Product",
      min: 0.1,
      max: 10,
      step: 0.1,
      type: "range",
      order: 3,
    },
    title: "Zoom",
  },
  "product-imgpos": {
    default: {
      y: 600,
      x: 600,
    },
    type: "object",
    hideInSheet: true,
    editorMeta: {
      group: "Product",
      step: 1,
      type: "joystick",
      order: 4,
    },
    title: "Position",
  },
};
describe("set tests", () => {
  it("1. Adding prop in existing path", () => {
    const state = set(
      {
        test: {
          testing: 4,
        },
        chat: {
          creative: {
            channel: 1234,
          },
        },
      },
      "chat.creative.channelSid",
      5678,
      {
        create: true,
      }
    );
    return expect(state).toEqual({
      test: {
        testing: 4,
      },
      chat: {
        creative: {
          channel: 1234,
          channelSid: 5678,
        },
      },
    });
  });

  it("2. Adding prop in non-existent path", () => {
    const state = set(
      {
        test: {
          testing: 4,
        },
      },
      "chat.creative.channelSid",
      5678,
      {
        create: true,
      }
    );
    return expect(state).toEqual({
      test: {
        testing: 4,
      },
      chat: {
        creative: {
          channelSid: 5678,
        },
      },
    });
  });

  it("3. Adding prop in non-existent path shopify issue", () => {
    const state = set(parameters, "quality.default", "full", {
      create: true,
    });
    const finalParameters = {
      ...parameters,
      quality: {
        default: "full",
      },
    };
    return expect(state).toEqual(finalParameters);
  });
});
