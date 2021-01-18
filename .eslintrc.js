module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["airbnb-base", "airbnb/rules/react", "airbnb/hooks", "plugin:prettier/recommended", "prettier/react", "plugin:@typescript-eslint/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.worker.js"],
      rules: {
        "no-restricted-globals": [0],
      },
    },
    {
      files: ["e2e/**/*.js"],
      rules: {
        "no-undef": [0],
      },
    },
  ],
  plugins: ["react"],
  rules: {
    "import/no-named-as-default": "off",
    "react/jsx-filename-extension": "off",
    "import/prefer-default-export": "off",
    "no-nested-ternary": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "prettier/prettier": "error",
    "no-unused-expressions": [
      2,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    "no-underscore-dangle": "off",
    "prefer-const": "off",
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": "off",
    "no-shadow": "off",
    "prefer-destructuring": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-bitwise": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
  },
};
