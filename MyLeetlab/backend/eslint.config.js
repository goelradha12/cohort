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
      // Allow intentionally unused identifiers when prefixed with "_"
      // (e.g. destructuring a field only to omit it, or an unused catch binding).
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
