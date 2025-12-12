import { parseSync, transformFromAstSync } from "@babel/core";
import traverse from "@babel/traverse";
import t from "@babel/types";

// At the moment this plugin doesn't support spread props
// This might be fine for the short term but in future
// I'll probably want to come back and add it.

export default function ninjassVitePlugin() {
  return {
    name: "ninjass",
    transform(sourceCode, id) {
      if (id.slice(-4) !== ".tsx") return;
      const match = sourceCode.match(/ css: ?\{/m);
      if (!match) return null;

      const ast = parseSync(sourceCode);

      let requiresImport = false;

      traverse.default(ast, {
        ObjectExpression(path) {
          if (
            path.parentPath.type === "CallExpression" &&
            // fuzzy match _jsx, jsxs, jsxDEV etc
            /jsxs?/.test(path.parentPath.node.callee.name) &&
            path.parentPath.node.arguments[0].type === "StringLiteral"
          ) {
            const css = path.node.properties.find(
              (prop) =>
                prop.type === "ObjectProperty" && prop.key.name === "css"
            );
            if (!css) return;

            css.value = t.callExpression(t.identifier("createStyle"), [
              css.value,
            ]);
            requiresImport = true;
          }
        },
      });

      if (requiresImport) {
        traverse.default(ast, {
          Program(path) {
            path.node.body.unshift(
              t.importDeclaration(
                [
                  t.importSpecifier(
                    t.identifier("createStyle"),
                    t.stringLiteral("createStyle")
                  ),
                ],
                t.stringLiteral("ninjass")
              )
            );
          },
        });
      }

      const { code, map } = transformFromAstSync(ast);

      return { code, map };
    },
  };
}
