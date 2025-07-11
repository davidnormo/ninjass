import esbuild from "esbuild";

await Promise.all([
  /**
   * Builds the main lib index.js
   * Can be used in either node or browser contexts
   */
  esbuild.build({
    entryPoints: ["./src/index.ts"],
    platform: "neutral",
    outfile: "./dist/index.js",
    bundle: true,
    define: {
      "process.env.IS_SERVER": "'false'",
    },
  }),
  /**
   * Builds the minified code required at the document head
   * to support the `css` attribute for server side rendering
   */
  esbuild.build({
    entryPoints: ["./src/client.ts"],
    platform: "browser",
    outfile: "./dist/client.js",
    minify: true,
    bundle: true,
    define: {
      "process.env.IS_SERVER": "'false'",
    },
  }),
]);
