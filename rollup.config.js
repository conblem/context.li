import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import filesize from "rollup-plugin-filesize";

const baseconfig = () => ({
  entry: "src/index.js",
  sourceMap: "inline",
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    peerDepsExternal(),
    filesize()
  ]
});

export default [
  {
    ...baseconfig(),
    format: "cjs",
    dest: "dist/index.js"
  },
  {
    ...baseconfig(),
    format: "es",
    dest: "dist/index.m.js"
  }
];
