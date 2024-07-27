// const tsParser = require("@typescript-eslint/parser")

// const tsPlugin = require("@typescript-eslint/eslint-plugin")

const eslintJS = require("@eslint/js")

module.exports = [
  {
    files: ["**/*.js", "**/*.ts"],
    ignores: ["derived/**", "dist/**", "dist2/**", "build/**", ".idea/**", "node_modules/**", "*.d.ts"],
    rules: {
      ...eslintJS.configs.recommended.rules,
      semi: ["error", "never"],
      quotes: [2, "double", { avoidEscape: true }],
      "prefer-template": "error",
    },
    languageOptions: {
      //  parser: tsParser,
      sourceType: "module",
      globals: {
        process: true,
        console: true,
        window: true,
        structuredClone: true,
        document: true,
        navigator: true,
        fetch: true,
        Headers: true,
      },
    },
    //  plugins: { "@typescript-eslint": tsPlugin },
  },
]
