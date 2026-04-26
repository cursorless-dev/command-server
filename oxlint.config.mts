import { defineConfig } from "oxlint";

const disabledRules = [
  "eslint/arrow-body-style",
  "eslint/capitalized-comments",
  "eslint/id-length",
  "eslint/init-declarations",
  "eslint/no-console",
  "eslint/no-continue",
  "eslint/no-eq-null",
  "eslint/no-magic-numbers",
  "eslint/no-negated-condition",
  "eslint/no-plusplus",
  "eslint/no-ternary",
  "eslint/no-undefined",
  "eslint/no-use-before-define",
  "eslint/no-void",
  "eslint/sort-imports",
  "eslint/sort-keys",
  "func-style",
  "import/exports-last",
  "import/group-exports",
  "import/max-dependencies",
  "import/no-named-export",
  "import/no-namespace",
  "import/no-nodejs-modules",
  "import/prefer-default-export",
  "oxc/no-async-await",
  "oxc/no-optional-chaining",
  "oxc/no-rest-spread-properties",
  "promise/prefer-await-to-callbacks",
  "typescript/prefer-readonly-parameter-types",
  "typescript/promise-function-async",
  "unicorn/filename-case",
  "unicorn/no-lonely-if",
  "unicorn/no-null",
  "unicorn/prefer-at",
  "unicorn/switch-case-braces",
];

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  env: {
    node: true,
    mocha: true,
  },
  plugins: [
    "eslint",
    "typescript",
    "unicorn",
    "oxc",
    "import",
    "node",
    "promise",
  ],
  categories: {
    correctness: "warn",
    suspicious: "warn",
    pedantic: "warn",
    perf: "warn",
    style: "warn",
    restriction: "warn",
    nursery: "warn",
  },

  rules: {
    ...Object.fromEntries(disabledRules.map((r) => [r, "off"])),
    "eslint/no-duplicate-imports": [
      "warn",
      {
        allowSeparateTypeImports: true,
      },
    ],
    "eslint/no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "node:assert",
            message: "Use node:assert/strict instead",
          },
        ],
      },
    ],
    "eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "typescript/no-confusing-void-expression": [
      "warn",
      {
        ignoreArrowShorthand: true,
      },
    ],
    "typescript/strict-boolean-expressions": [
      "warn",
      {
        allowNullableBoolean: true,
      },
    ],
    eqeqeq: [
      "warn",
      "always",
      {
        null: "never",
      },
    ],
  },

  overrides: [
    {
      files: ["src/test/**/*.ts"],
      rules: {
        "unicorn/prefer-module": "off",
        "unicorn/prefer-top-level-await": "off",
      },
    },
  ],
});
