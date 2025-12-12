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
  }),
  /**
   * Builds the vite plugin
   */
  esbuild.build({
    entryPoints: ["./src/vitePlugin.ts"],
    platform: "node",
    outfile: "./dist/vitePlugin.js",
  }),
]);
