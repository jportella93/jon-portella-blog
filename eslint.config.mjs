import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import path from "node:path";

const tsconfigRootDir = path.resolve(import.meta.dirname);

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      ".turbo/**",
      "node_modules/**",
      ".npm-cache/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
];
