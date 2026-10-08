import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "dist-*", "dev-dist", "artifacts", "tmp", "android/**/assets", "node_modules", "public/backups", "public/ar-hand-tracking/wasm", "public/twodgraph.js", "public/twodgeometry.js", "public/threedgraph.js", "public/threedgeometry.js", "*.tsbuildinfo", "vite.config.js"],
  },
  {
    files: ["public/sw.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.serviceworker,
    },
  },
  {
    files: ["scripts/**/*.mjs", "tmp/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
