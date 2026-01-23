# Quickstart

## 目标

演示如何调用 `getBlocksByImage` 获取连通域外包围盒，并调整阈值与膨胀半径。

## 浏览器使用示例

```ts
import { getBlocksByImage } from 'image2blocks';

const fileInput = document.querySelector<HTMLInputElement>('#file')!;

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const blocks = await getBlocksByImage(file, {
    threshold: 128,
    dilationRadius: 2,
  });

  console.log(blocks);
});
```

## Node.js 使用示例

```ts
import { readFile } from 'node:fs/promises';
import { getBlocksByImage } from 'image2blocks';

const buffer = await readFile('./fixtures/sample.png');
const blocks = await getBlocksByImage(buffer.buffer, {
  threshold: 128,
  dilationRadius: 2,
});

console.log(blocks);
```
