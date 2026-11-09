/**
 * Dev-only, web-only: tags every JSX element with its source location, so the browser
 * inspector shows e.g. `data-source="src/components/habits/habit-card.tsx:34"`.
 *
 * Adds `dataSet={{ source: '<file>:<line>' }}`, which react-native-web renders as a
 * `data-source` attribute. Components that don't forward props to a View/Text just drop it.
 */
const path = require('path');

module.exports = function jsxSourcePlugin(api) {
  const { types: t } = api;
  const platform = api.caller((caller) => caller?.platform);
  const isDev = api.caller((caller) => caller?.isDev);
  const projectRoot =
    api.caller((caller) => caller?.projectRoot) ?? process.cwd();

  if (platform !== 'web' || !isDev) {
    return { name: 'jsx-source', visitor: {} };
  }

  return {
    name: 'jsx-source',
    visitor: {
      JSXOpeningElement(nodePath, state) {
        const { node } = nodePath;
        const filename = state.filename;
        if (!filename || filename.includes('node_modules') || !node.loc) return;

        // Lowercase tags are DOM elements, where `dataSet` isn't a valid prop.
        const name = node.name;
        if (t.isJSXIdentifier(name) && /^[a-z]/.test(name.name)) return;

        // Fragments only accept `key` and `children`.
        const tagName = t.isJSXMemberExpression(name)
          ? name.property.name
          : name.name;
        if (tagName === 'Fragment') return;

        // Don't override a hand-written dataSet.
        const hasDataSet = node.attributes.some(
          (attr) => t.isJSXAttribute(attr) && attr.name.name === 'dataSet',
        );
        if (hasDataSet) return;

        const file = path.relative(projectRoot, filename);
        const source = `${file}:${node.loc.start.line}`;
        // First, so a spread like `{...rest}` can override it: wrappers such as ThemedView
        // then show where they're used rather than their own inner View.
        node.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('dataSet'),
            t.jsxExpressionContainer(
              t.objectExpression([
                t.objectProperty(
                  t.identifier('source'),
                  t.stringLiteral(source),
                ),
              ]),
            ),
          ),
        );
      },
    },
  };
};
