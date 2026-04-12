// 简单的构建脚本
import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const dependencies = pkg.dependencies || {};
const externalList = Object.keys(dependencies).filter(dep => dep !== 'dayjs');

try {
  await build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist',
    external: externalList,
  });
  console.log('⚡ Build complete!');
} catch (e) {
  console.error(e);
  process.exit(1);
}
