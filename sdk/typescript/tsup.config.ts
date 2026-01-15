import { defineConfig } from 'tsup';

export default defineConfig([
  // Main SDK bundle
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react'],
  },
  // React bundle (separate)
  {
    entry: ['src/react/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outDir: 'dist/react',
    external: ['react'],
  },
]);
