import { createCanvas } from 'canvas';

export interface TestRect {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface TestImage {
  width: number;
  height: number;
  buffer: Buffer;
  arrayBuffer: ArrayBuffer;
  dataUrl: string;
}

export function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}

export function createTestImage(width: number, height: number, rects: TestRect[], background = '#ffffff'): TestImage {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  rects.forEach(rect => {
    ctx.fillStyle = rect.color ?? '#000000';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  });

  const buffer = canvas.toBuffer('image/png');
  return {
    width,
    height,
    buffer,
    arrayBuffer: bufferToArrayBuffer(buffer),
    dataUrl: `data:image/png;base64,${buffer.toString('base64')}`,
  };
}
