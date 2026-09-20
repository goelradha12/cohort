import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["src/generated/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
    },
  },
];
