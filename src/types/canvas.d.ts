declare module 'canvas' {
  export interface CanvasRenderingContext2D {
    fillStyle: string;
    fillRect(x: number, y: number, width: number, height: number): void;
  }

  export interface Canvas {
    getContext(contextId: '2d'): CanvasRenderingContext2D;
    toBuffer(mimeType?: string): Buffer;
  }

  export function createCanvas(width: number, height: number): Canvas;
}
