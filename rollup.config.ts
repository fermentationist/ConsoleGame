import itemLoader from "./src/utils/rollup-plugin-item-loader";
import terser from "@rollup/plugin-terser";

export default {
  input: "lib/index.js",
	context: "window",
	plugins: [itemLoader, terser()],
  output: {
    dir: "dist",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags, will prevent variables from leaking into the global scope (unless done so explicitly)
    sourcemap: true,
  },
};
