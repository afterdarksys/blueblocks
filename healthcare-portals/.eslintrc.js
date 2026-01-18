module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", ".turbo/"],
  overrides: [
    {
      files: ["*.tsx"],
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      settings: { react: { version: "detect" } },
      rules: { "react/react-in-jsx-scope": "off", "react/prop-types": "off" },
    },
  ],
};
