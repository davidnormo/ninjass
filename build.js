import esbuild from "esbuild";
import { readFile } from "fs/promises";

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
   * Builds styles.css file
   */
  esbuild.build({
    entryPoints: ["./src/styles.css"],
    platform: "browser",
    outfile: "./dist/styles.css",
    minify: true,
    bundle: true,
    plugins: [
      // Leaving this here in case we want something in future
      // {
      //   name: "ninjass-css-helpers",
      //   setup(build) {
      //     build.onLoad({ filter: /.css$/ }, async (args) => {
      //       let text = await readFile(args.path, "utf8");
      //       return {
      //         contents: text.replaceAll(
      //           / lightDark\((.+)\)/g,
      //           " light-dark(var(--p-l-$1), var(--p-d-$1))"
      //         ),
      //         loader: "css",
      //       };
      //     });
      //   },
      // },
    ],
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
