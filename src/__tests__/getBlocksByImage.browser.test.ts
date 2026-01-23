/** @jest-environment jsdom */

import { getBlocksByImage } from '../index';
import { createTestImage } from '../test-utils/canvas';

describe('getBlocksByImage (browser File input)', () => {
  it('supports File input in browser-like environment', async () => {
    const image = createTestImage(12, 12, [{ x: 2, y: 2, width: 4, height: 4 }]);
    const file = new File([image.arrayBuffer], 'fixture.png', { type: 'image/png' });

    const blocks = await getBlocksByImage(file, {
      threshold: 128,
      dilationRadius: 0,
    });

    expect(blocks).toEqual([
      {
        id: 1,
        area: 16,
        bbox: { x: 2, y: 2, width: 4, height: 4 },
      },
    ]);
  });
});
