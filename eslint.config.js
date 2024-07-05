module.exports = [
  {
    files: ["**/*.js", "**/*.ts"],
    ignores: ["derived/*", "dist/*", "build/*", ".idea/*", "node_modules/*", "*.d.ts"],
    rules: {
      semi: ["error", "never"],
      quotes: [2, "double", { avoidEscape: true }],
      "prefer-template": "error",
    },
  },
]
