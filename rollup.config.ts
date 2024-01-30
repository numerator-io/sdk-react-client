import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import filesize from 'rollup-plugin-filesize';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const plugins = [typescript()];
const external = /node_modules/;

export default [
  {
    input: 'index.ts',
    output: [
      {
        file: 'lib/umd/index.js',
        format: 'umd',
        sourcemap: true,
        name: 'Numerator',
      },
    ],
    plugins,
    external,
  },
  {
    input: 'index.ts',
    output: [
      {
        file: 'lib/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'index.ts',
    output: [
      {
        file: 'lib/esm/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'umd',
        sourcemap: true,
        name: 'Numerator',
      },
    ],
    plugins,
    external,
  },
  {
    input: 'index.ts',
    plugins: [dts(), json()],
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
  },
];
