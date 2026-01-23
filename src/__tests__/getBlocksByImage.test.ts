import { getBlocksByImage, type Block, type ImageInput } from '../index';
import { createTestImage } from '../test-utils/canvas';

function sortBlocks(blocks: Block[]): Block[] {
  return [...blocks].sort((a, b) => {
    if (a.bbox.y !== b.bbox.y) {
      return a.bbox.y - b.bbox.y;
    }
    return a.bbox.x - b.bbox.x;
  });
}

describe('getBlocksByImage', () => {
  it('returns two blocks with expected bounding boxes', async () => {
    const image = createTestImage(20, 20, [
      { x: 2, y: 3, width: 4, height: 5 },
      { x: 12, y: 10, width: 3, height: 4 },
    ]);

    const blocks = await getBlocksByImage(image.dataUrl, {
      threshold: 128,
      dilationRadius: 0,
    });

    const sorted = sortBlocks(blocks);
    expect(sorted).toEqual([
      {
        id: 1,
        area: 20,
        bbox: { x: 2, y: 3, width: 4, height: 5 },
      },
      {
        id: 2,
        area: 12,
        bbox: { x: 12, y: 10, width: 3, height: 4 },
      },
    ]);
  });

  it('returns empty list for blank images', async () => {
    const image = createTestImage(10, 10, []);

    const blocks = await getBlocksByImage(image.dataUrl);

    expect(blocks).toEqual([]);
  });

  it('throws on invalid input type', async () => {
    const invalidInput = 123 as unknown as ImageInput;

    await expect(getBlocksByImage(invalidInput)).rejects.toThrow(
      'Unsupported image input. Expected base64 string, File, ArrayBuffer, HTMLCanvasElement, or HTMLImageElement.',
    );
  });

  it('handles tiny images', async () => {
    const image = createTestImage(1, 1, [{ x: 0, y: 0, width: 1, height: 1 }]);

    const blocks = await getBlocksByImage(image.dataUrl);

    expect(blocks).toEqual([
      {
        id: 1,
        area: 1,
        bbox: { x: 0, y: 0, width: 1, height: 1 },
      },
    ]);
  });

  it('keeps regression expectations for standard fixture', async () => {
    const image = createTestImage(24, 18, [
      { x: 1, y: 2, width: 3, height: 3 },
      { x: 9, y: 1, width: 4, height: 2 },
      { x: 14, y: 10, width: 5, height: 4 },
    ]);

    const blocks = await getBlocksByImage(image.dataUrl, {
      threshold: 128,
      dilationRadius: 0,
    });

    const sorted = sortBlocks(blocks);
    expect(sorted).toEqual([
      {
        id: 1,
        area: 8,
        bbox: { x: 9, y: 1, width: 4, height: 2 },
      },
      {
        id: 2,
        area: 9,
        bbox: { x: 1, y: 2, width: 3, height: 3 },
      },
      {
        id: 3,
        area: 20,
        bbox: { x: 14, y: 10, width: 5, height: 4 },
      },
    ]);
  });

  it('responds to threshold changes', async () => {
    const image = createTestImage(12, 12, [{ x: 3, y: 3, width: 4, height: 4, color: 'rgb(120, 120, 120)' }]);

    const lowThresholdBlocks = await getBlocksByImage(image.dataUrl, {
      threshold: 100,
      dilationRadius: 0,
    });
    const highThresholdBlocks = await getBlocksByImage(image.dataUrl, {
      threshold: 150,
      dilationRadius: 0,
    });

    expect(lowThresholdBlocks).toEqual([]);
    expect(highThresholdBlocks).toEqual([
      {
        id: 1,
        area: 16,
        bbox: { x: 3, y: 3, width: 4, height: 4 },
      },
    ]);
  });

  it('expands bounding boxes when dilationRadius increases', async () => {
    const image = createTestImage(12, 12, [{ x: 4, y: 4, width: 2, height: 2 }]);

    const noDilate = await getBlocksByImage(image.dataUrl, {
      threshold: 128,
      dilationRadius: 0,
    });
    const dilated = await getBlocksByImage(image.dataUrl, {
      threshold: 128,
      dilationRadius: 1,
    });

    expect(noDilate).toEqual([
      {
        id: 1,
        area: 4,
        bbox: { x: 4, y: 4, width: 2, height: 2 },
      },
    ]);
    expect(dilated).toEqual([
      {
        id: 1,
        area: 16,
        bbox: { x: 3, y: 3, width: 4, height: 4 },
      },
    ]);
  });

  it('supports ArrayBuffer input', async () => {
    const image = createTestImage(10, 10, [{ x: 2, y: 2, width: 3, height: 3 }]);

    const blocks = await getBlocksByImage(image.arrayBuffer);

    expect(blocks).toEqual([
      {
        id: 1,
        area: 9,
        bbox: { x: 2, y: 2, width: 3, height: 3 },
      },
    ]);
  });

  it('supports raw base64 input', async () => {
    const image = createTestImage(10, 10, [{ x: 5, y: 1, width: 2, height: 3 }]);
    const rawBase64 = image.buffer.toString('base64');

    const blocks = await getBlocksByImage(rawBase64);

    expect(blocks).toEqual([
      {
        id: 1,
        area: 6,
        bbox: { x: 5, y: 1, width: 2, height: 3 },
      },
    ]);
  });
});
