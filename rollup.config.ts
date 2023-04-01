import itemLoader from "./src/utils/rollup-plugin-item-loader";
export default {
  input: "lib/index.js",
	context: "window",
	plugins: [itemLoader],
  output: {
    dir: "dist",
    format: "cjs",
  },
};
