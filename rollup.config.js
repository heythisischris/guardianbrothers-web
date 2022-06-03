import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from '@rollup/plugin-json';

const isDev = Boolean(process.env.ROLLUP_WATCH);

export default [
  // Browser bundle
  {
    input: "src/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/bundle.js",
      inlineDynamicImports: true
    },
    plugins: [
      svelte({
        hydratable: true
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
        dedupe: ["svelte"],
      }),
      commonjs(),
      !isDev && terser(),
      json(),
    ]
  },
  // Server bundle
  {
    input: "src/App.svelte",
    output: {
      sourcemap: false,
      format: "cjs",
      name: "app",
      file: "public/App.js",
      inlineDynamicImports: true
    },
    plugins: [
      svelte({
        generate: "ssr"
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
        dedupe: ["svelte"],
      }),
      commonjs(),
      !isDev && terser(),
      json(),
    ]
  }
];
