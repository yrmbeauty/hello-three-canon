// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: ["dist"],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        arrowParens: "avoid",
      },
    ],
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-undef
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
