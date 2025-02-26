/* eslint-env node */
module.exports = {
  env: {
    node: true, // This enables Node.js global variables (like module, require, and exports)
    es2021: true, // Use modern ECMAScript features
  },
  globals: {
    module: "readonly",
    require: "readonly",
    exports: "readonly",
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
};
