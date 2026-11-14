import { readdirSync } from "node:fs";

import { builtinRules } from "eslint/use-at-your-own-risk";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Feature boundary (AGENTS.md "Boundary"): dependencies flow shared → features → app.
// One rule block per folder in src/features, so a new feature is covered the moment it exists.
// Each layer is blocked by its `@/` alias and by any relative `../` path that climbs into it.
const FEATURES = readdirSync(new URL("./src/features", import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const layerImports = (layer, aliasPath, message) => ({
  group: [aliasPath, `${aliasPath}/**`, `../**/${layer}`, `../**/${layer}/**`],
  message,
});

const appImports = layerImports(
  "app",
  "@/app",
  "Features must not import src/app; routes depend on features, never the reverse.",
);
const featureImports = (feature, from) =>
  layerImports(
    feature,
    `@/features/${feature}`,
    `${from} must not import the ${feature} feature; move what both need to src/features/shared.`,
  );

const boundaryRules = FEATURES.map((from) => ({
  files: [`src/features/${from}/**/*.{ts,tsx,mts,mjs}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          appImports,
          ...FEATURES.filter((other) => other !== from && other !== "shared").map((other) =>
            featureImports(other, from),
          ),
        ],
      },
    ],
  },
}));

// Token-only styling (AGENTS.md): UI colors come from the semantic tokens in src/app/globals.css.
// The default palette is removed there, so a raw class like `bg-zinc-200` would silently render
// nothing; this rule makes it (and literal colors) a lint error instead. A local plugin rather than
// `no-restricted-syntax` so it never overrides other `no-restricted-syntax` blocks.
const RAW_PALETTE_CLASS =
  /(?:^|[\s:])(?:bg|text|border(?:-[xytrblse])?|divide|outline|ring(?:-offset)?|fill|stroke|from|via|to|placeholder|caret|accent|decoration|shadow|inset-shadow|drop-shadow)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mist|mauve|olive|taupe)-(?:50|[1-9]00|950))(?:\/\d+)?(?=$|\s)/;
const RAW_COLOR =
  /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])|(?<![a-z0-9])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/i;

const designTokensPlugin = {
  rules: {
    "no-raw-color": {
      meta: {
        type: "problem",
        messages: {
          paletteClass:
            'Raw palette class "{{match}}": use a semantic token utility from src/app/globals.css (bg-surface, text-muted, border-line…).',
          rawColor:
            'Raw color "{{match}}": declare a token in src/app/globals.css and use its utility (or themeColor() from src/features/shared/theme/themeTokens.ts on the server).',
        },
        schema: [],
      },
      create(context) {
        function check(node, text) {
          const palette = RAW_PALETTE_CLASS.exec(text);
          if (palette) {
            context.report({
              node,
              messageId: "paletteClass",
              data: { match: palette[0].replace(/^[\s:]/, "") },
            });
            return;
          }
          const color = RAW_COLOR.exec(text);
          if (color) {
            context.report({ node, messageId: "rawColor", data: { match: color[0] } });
          }
        }
        return {
          Literal(node) {
            if (typeof node.value === "string") check(node, node.value);
          },
          TemplateElement(node) {
            check(node, node.value.cooked ?? node.value.raw);
          },
        };
      },
    },
  },
};

const COPY_MESSAGE =
  'UI copy lives in src/content (AGENTS.md "Copy"): import the text from there instead of writing it here.';

// Attributes whose value people read or hear: tooltips, accessible names, alt text, field labels.
const COPY_ATTRIBUTE =
  "JSXAttribute[name.name=/^(aria-label|title|alt|placeholder|label|hint|.*Label)$/]";
const NON_EMPTY_STRING = "Literal[value=/\\S/]";

// Text in markup: JSX text, string children, and string attributes people read.
const copyRules = [
  "JSXText[value=/\\S/]",
  `:matches(JSXElement, JSXFragment) > JSXExpressionContainer > ${NON_EMPTY_STRING}`,
  ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral",
  `:matches(JSXElement, JSXFragment) > JSXExpressionContainer > :matches(ConditionalExpression, LogicalExpression) > ${NON_EMPTY_STRING}`,
  `${COPY_ATTRIBUTE} > ${NON_EMPTY_STRING}`,
  `${COPY_ATTRIBUTE} > JSXExpressionContainer > ${NON_EMPTY_STRING}`,
  `${COPY_ATTRIBUTE} > JSXExpressionContainer > TemplateLiteral`,
  `${COPY_ATTRIBUTE} > JSXExpressionContainer > :matches(ConditionalExpression, LogicalExpression) > ${NON_EMPTY_STRING}`,
  `AssignmentPattern[left.name=/Label$/] > ${NON_EMPTY_STRING}`,
].map((selector) => ({ selector, message: COPY_MESSAGE }));

// Messages that reach people from any module: thrown errors, toast and dialog messages, metadata.
const copyMessageRules = [
  "NewExpression[callee.name='Error'] > :matches(Literal, TemplateLiteral)",
  "Property[key.name=/^(message|title|description|name)$/] > :matches(Literal, TemplateLiteral)",
  "Property[key.name=/^(title|name)$/] > LogicalExpression > :matches(Literal, TemplateLiteral)",
  "CallExpression[callee.property.name='confirm'] > :matches(Literal, TemplateLiteral)",
].map((selector) => ({ selector, message: COPY_MESSAGE }));

// Types rule (AGENTS.md): every interface/type lives in an X.type.ts file next to its user; tests may
// keep local types. Merged into the same no-restricted-syntax arrays as the copy rules: in flat config
// a second no-restricted-syntax block for the same files would silently replace the first.
const TYPE_FILE_MESSAGE =
  "Types live in an X.type.ts file next to the file that uses them (AGENTS.md); tests may keep local types.";
const typeFileRules = ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"].map((selector) => ({
  selector,
  message: TYPE_FILE_MESSAGE,
}));

// Component architecture (AGENTS.md "Component architecture" / "Styling architecture"): a .tsx
// component is presentation only. Classes come from X.style.ts (composed with cx()), data from
// X.data.ts / src/content, derived values and behavior from a useX.ts hook next to the component.
const CLASS_STRING_MESSAGE = "Class strings belong in the component's .style.ts file, not in .tsx.";
const classStringRules = [
  "JSXAttribute[name.name='className'] > Literal",
  "JSXAttribute[name.name='className'] > JSXExpressionContainer > Literal",
  "JSXAttribute[name.name='className'] > JSXExpressionContainer > TemplateLiteral",
  "Property[key.name='className'] > Literal",
  "Property[key.name='className'] > TemplateLiteral",
  "JSXAttribute[name.name='className'] CallExpression > Literal",
  "JSXAttribute[name.name='className'] LogicalExpression > Literal",
  "JSXAttribute[name.name='className'] ConditionalExpression > Literal",
].map((selector) => ({ selector, message: CLASS_STRING_MESSAGE }));

const BEHAVIOR_MESSAGE =
  "Components are presentation: move effects and browser APIs into a useX.ts hook next to the component.";
const presentationRules = [
  "ImportSpecifier[imported.name=/^use(Layout|Insertion)?Effect$/]",
  "MemberExpression[object.name=/^(window|document|navigator|history|location)$/]",
  "NewExpression[callee.name=/^(IntersectionObserver|ResizeObserver|MutationObserver)$/]",
  "CallExpression[callee.name=/^(setTimeout|setInterval|requestAnimationFrame)$/]",
].map((selector) => ({ selector, message: BEHAVIOR_MESSAGE }));

const LOGIC_MESSAGE =
  "Components are presentation: derive values in a useX.ts hook or a .ts module, not in .tsx.";
const logicRules = [
  // Helper functions, at module level or inside a component.
  "Program > FunctionDeclaration[id.name=/^[a-z]/]",
  "Program > ExportNamedDeclaration > FunctionDeclaration[id.name=/^[a-z]/]",
  "FunctionDeclaration FunctionDeclaration",
  "VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)",
  // Computation and formatting.
  "BinaryExpression[operator=/^[-+*\\/%]$/]",
  "ConditionalExpression > ConditionalExpression",
  "TemplateLiteral[expressions.length>0]",
  "NewExpression[callee.name=/^(Date|URL|Map|Set)$/]",
  "CallExpression[callee.property.name=/^(filter|reduce|sort|find|findIndex|some|every|flatMap|slice|splice|join|split|replace|replaceAll|toFixed|toLocaleString)$/]",
  // Plain function calls in markup; only the class helper is allowed.
  "JSXExpressionContainer > CallExpression[callee.type='Identifier']:not([callee.name='cx'])",
].map((selector) => ({ selector, message: LOGIC_MESSAGE }));

const DATA_MESSAGE =
  "Data a component renders belongs in an X.data.ts module (or src/content), not in .tsx.";
const dataRules = [
  "Program > VariableDeclaration > VariableDeclarator > :matches(ArrayExpression, ObjectExpression, Literal, TemplateLiteral, CallExpression)",
  "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > :matches(ArrayExpression, ObjectExpression, Literal, TemplateLiteral, CallExpression)",
  "MemberExpression > ArrayExpression.object",
].map((selector) => ({ selector, message: DATA_MESSAGE }));

const STYLE_COMPOSE_MESSAGE =
  "Compose classes with cx() in .style.ts: no .join() or template literals, so there's one way to do it and Tailwind sees every class literally.";
const styleComposeRules = [
  "CallExpression[callee.property.name='join']",
  "TemplateLiteral[expressions.length>0]",
].map((selector) => ({ selector, message: STYLE_COMPOSE_MESSAGE }));

// The architecture selectors run through a second registration of the core `no-restricted-syntax`
// rule, `presentation/no-restricted-syntax`. A rule has one option list per file and a later block
// replaces an earlier one, so under its own name it never displaces (or is displaced by) the copy
// and type rules above.
const presentationPlugin = {
  rules: { "no-restricted-syntax": builtinRules.get("no-restricted-syntax") },
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `const { a, ...rest } = props` is how components drop props they handle themselves.
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Interfaces are IName, type aliases TName (AGENTS.md); the rest of the name is PascalCase.
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
        { selector: "typeAlias", format: ["PascalCase"], prefix: ["T"] },
      ],
    },
  },
  ...boundaryRules,
  // Accessibility: next registers the jsx-a11y plugin but enables only a handful of its rules.
  {
    files: ["src/**/*.tsx"],
    rules: { ...jsxA11y.flatConfigs.strict.rules },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.{ts,tsx}"],
    plugins: { "design-tokens": designTokensPlugin },
    rules: { "design-tokens/no-raw-color": "error" },
  },
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.test.tsx"],
    rules: {
      "no-restricted-syntax": ["error", ...copyRules, ...copyMessageRules, ...typeFileRules],
    },
  },
  {
    files: ["src/**/*.ts"],
    ignores: [
      "src/content/**",
      "src/**/*.style.ts",
      "src/**/*.test.ts",
      "src/**/*.type.ts",
      "src/**/*.d.ts",
    ],
    rules: {
      "no-restricted-syntax": ["error", ...copyMessageRules, ...typeFileRules],
    },
  },
  {
    // Copy files hold the text itself; style files hold classes under keys like `title`, not copy.
    files: ["src/content/**/*.ts", "src/**/*.style.ts"],
    ignores: ["src/**/*.type.ts", "src/**/*.test.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...typeFileRules],
    },
  },
  // Presentation-only components: every component file, tests excepted.
  {
    files: ["**/*.tsx"],
    ignores: ["**/*.test.tsx"],
    plugins: { presentation: presentationPlugin },
    rules: {
      "presentation/no-restricted-syntax": [
        "error",
        ...classStringRules,
        ...presentationRules,
        ...logicRules,
        ...dataRules,
      ],
    },
  },
  // Style files hold class strings composed with cx() (AGENTS.md "Styling architecture").
  {
    files: ["**/*.style.ts"],
    plugins: { presentation: presentationPlugin },
    rules: { "presentation/no-restricted-syntax": ["error", ...styleComposeRules] },
  },
  // Stories and Storybook configuration are documentation and test harness, not production components.
  {
    files: ["**/*.stories.tsx", ".storybook/**"],
    rules: {
      "presentation/no-restricted-syntax": "off",
      "no-restricted-syntax": "off",
      "@typescript-eslint/naming-convention": "off",
    },
  },
  globalIgnores([
    "storybook-static/**",
    ".next/**",
    ".next-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    ".superpowers/**",
    // Vendored agent skills (skills-lock.json): third-party files, updated with `npx skills update`.
    ".agents/**",
    ".claude/**",
  ]),
]);
