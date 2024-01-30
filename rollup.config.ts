import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

const plugins = [typescript()];
const external = /node_modules/;

export default [
  {
    input: 'src/main/index.tsx',
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
    input: 'src/main/index.tsx',
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
    input: 'src/main/index.tsx',
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
    input: 'src/main/index.tsx',
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
    input: 'src/main/index.tsx',
    plugins: [dts(), json()],
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
  },
];
