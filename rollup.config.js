import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'litedash',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      typescript(),
      resolve({
        browser: true,
        preferBuiltins: false
      }), // so Rollup can find external deps
      babel({
        babelrc: false,
        exclude: "node_modules/**",
        plugins: [
          require("@babel/plugin-proposal-class-properties"),
          require("@babel/plugin-proposal-function-bind"),
          require("@babel/plugin-proposal-object-rest-spread")
        ],
        extensions: ['.js', '.ts']
      }),
      commonjs(), // so Rollup can convert external deps to ES6
      terser()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      typescript()
    ]
  }
];