import { performance } from 'node:perf_hooks';

import { getBlocksByImage } from '../../index';
import { createTestImage } from '../../test-utils/canvas';

describe('getBlocksByImage performance', () => {
  it('processes a 2000x2000 image within expected budget', async () => {
    const image = createTestImage(2000, 2000, [
      { x: 120, y: 140, width: 300, height: 240 },
      { x: 800, y: 500, width: 260, height: 180 },
      { x: 1400, y: 1200, width: 320, height: 280 },
    ]);

    const start = performance.now();
    const blocks = await getBlocksByImage(image.arrayBuffer, {
      threshold: 128,
      dilationRadius: 0,
    });
    const durationMs = performance.now() - start;

    expect(blocks.length).toBe(3);
    expect(durationMs).toBeLessThanOrEqual(3000);
  }, 30000);
});
