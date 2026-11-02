import {access} from 'node:fs/promises';

async function exists(relative) {
  try { await access(new URL(relative, import.meta.url)); return true; }
  catch { return false; }
}

try {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 19)) {
    throw new Error(`需要 Node.js 22.19 或更高版本，当前为 ${process.versions.node}。`);
  }
  if (!(await exists('../dist/index.html'))) {
    const inputs = ['../src/main.ts', '../index.html', '../public/runtime-manifest.json', './build.mjs'];
    for (const input of inputs) {
      if (!(await exists(input))) {
        throw new Error('网页运行文件不完整。请完整解压离线包，或重新下载包含源码与资源的项目。');
      }
    }
    console.log('首次启动，正在从本地源码生成网页；无需安装 npm 依赖或下载模型。');
    await import('./build.mjs');
  }
  await import('./serve.mjs');
} catch (error) {
  console.error('与画相逢启动失败：', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
