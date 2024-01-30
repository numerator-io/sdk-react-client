import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

const plugins = [typescript()];
const external = /node_modules/;

export default [
  // Browser UMD bundle for CDN
  {
    input: 'src/main/index.tsx',
    output: [
      {
        file: 'lib/index.js',
        format: 'umd',
        name: 'Numerator',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },

  // Browser CJS bundle
  {
    input: 'src/main/index.tsx',
    output: [
      {
        file: 'lib/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },

  // browser ESM bundle for CDN
  {
    input: 'src/main/index.tsx',
    output: [
      {
        file: 'lib/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'src/main/index.tsx',
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
    plugins: [typescript(), dts(), json()],
    external,
  },
];
