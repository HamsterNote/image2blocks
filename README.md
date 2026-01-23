# image2blocks

Extract connected component bounding boxes from images using `image-js` in Node.js and browsers.

## Install

```bash
npm install image2blocks
```

## Usage

### Browser

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

### Node.js

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

## API

```ts
type ImageInput = string | ArrayBuffer | File;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Block {
  id: number;
  bbox: Box;
  area?: number;
}

interface DetectionParams {
  threshold?: number;
  dilationRadius?: number;
}

declare function getBlocksByImage(
  input: ImageInput,
  params?: DetectionParams,
): Promise<Block[]>;
```
