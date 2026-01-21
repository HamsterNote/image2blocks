import { Image, type BinaryValue } from 'image-js';

export type ImageInput = string | ArrayBuffer | File;

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Block {
  id: number;
  bbox: Box;
  area?: number;
}

export interface DetectionParams {
  /** Threshold for binarization (0-255). Default: 128 */
  threshold?: number;
  /** Dilation radius in pixels. 0 to skip. Default: 0 */
  dilationRadius?: number;
}

export interface RoiOptions {
  minSurface?: number;
  maxSurface?: number;
  // 4 or 8 connectivity; if 8, diagonals are connected
  connectivity?: 4 | 8;
}

export interface ProcessOptions extends DetectionParams, RoiOptions {}

export type ConnectedComponent = Block;

const DEFAULT_THRESHOLD = 128;
const DEFAULT_DILATION_RADIUS = 0;

const DATA_URL_PREFIX = 'data:';

function isCanvasElement(value: unknown): value is HTMLCanvasElement {
  return typeof HTMLCanvasElement !== 'undefined' && value instanceof HTMLCanvasElement;
}

function isImageElement(value: unknown): value is HTMLImageElement {
  return typeof HTMLImageElement !== 'undefined' && value instanceof HTMLImageElement;
}

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function normalizeBase64Input(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith(DATA_URL_PREFIX)) {
    return trimmed;
  }
  return `data:image/png;base64,${trimmed}`;
}

function normalizeThreshold(threshold?: number): number {
  if (threshold == null) {
    return DEFAULT_THRESHOLD;
  }
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 255) {
    throw new Error('threshold must be a number between 0 and 255.');
  }
  return threshold;
}

function normalizeDilationRadius(dilationRadius?: number): number {
  if (dilationRadius == null) {
    return DEFAULT_DILATION_RADIUS;
  }
  if (!Number.isFinite(dilationRadius) || !Number.isInteger(dilationRadius) || dilationRadius < 0) {
    throw new Error('dilationRadius must be a non-negative integer.');
  }
  return dilationRadius;
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') {
    return file.arrayBuffer();
  }

  if (typeof FileReader === 'undefined') {
    throw new Error('File.arrayBuffer is not available in this environment.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        resolve(result);
      } else {
        reject(new Error('Failed to read File as ArrayBuffer.'));
      }
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('Failed to read File.'));
    };
    reader.readAsArrayBuffer(file);
  });
}

function buildSquareKernel(radius: number): BinaryValue[][] {
  const size = radius * 2 + 1;
  return Array.from({ length: size }, () => Array(size).fill(1 as BinaryValue));
}

async function loadImageFromInput(input: ImageInput | HTMLCanvasElement | HTMLImageElement): Promise<Image> {
  if (typeof input === 'string') {
    return Image.load(normalizeBase64Input(input));
  }

  if (isFile(input)) {
    const arrayBuffer = await readFileAsArrayBuffer(input);
    return Image.load(arrayBuffer);
  }

  if (input instanceof ArrayBuffer) {
    return Image.load(input);
  }

  if (isCanvasElement(input)) {
    if (typeof Image.fromCanvas === 'function') {
      return Image.fromCanvas(input);
    }
    const dataUrl = input.toDataURL('image/png');
    return Image.load(dataUrl);
  }

  if (isImageElement(input)) {
    const src = input.currentSrc || input.src;
    return Image.load(src);
  }

  throw new Error('Unsupported image input. Expected base64 string, File, or ArrayBuffer.');
}

function extractBlocksFromMask(
  mask: Image,
  options: { allowCorners: boolean; minSurface?: number; maxSurface?: number },
): Block[] {
  const roiManager = mask.getRoiManager();
  roiManager.fromMaskConnectedComponentLabelingAlgorithm(mask, {
    allowCorners: options.allowCorners,
  });
  const rois = roiManager.getRois({
    positive: true,
    negative: false,
    minSurface: options.minSurface ?? 0,
    maxSurface: options.maxSurface ?? Number.POSITIVE_INFINITY,
  });
  return rois.map(roi => ({
    id: roi.id,
    area: roi.surface,
    bbox: {
      x: roi.minX,
      y: roi.minY,
      width: roi.width,
      height: roi.height,
    },
  }));
}

export async function getBlocksByImage(input: ImageInput, params: DetectionParams = {}): Promise<Block[]> {
  const threshold = normalizeThreshold(params.threshold);
  const dilationRadius = normalizeDilationRadius(params.dilationRadius);
  const image = await loadImageFromInput(input);

  const grey = image.grey();
  const mask = grey.mask({ threshold, invert: true });

  const processedMask = dilationRadius > 0 ? mask.dilate({ kernel: buildSquareKernel(dilationRadius) }) : mask;

  return extractBlocksFromMask(processedMask, { allowCorners: true });
}

export async function imageToConnectedComponents(
  input: ImageInput | HTMLCanvasElement | HTMLImageElement,
  options: ProcessOptions = {},
): Promise<ConnectedComponent[]> {
  const threshold = normalizeThreshold(options.threshold);
  const dilationRadius = normalizeDilationRadius(options.dilationRadius);
  const image = await loadImageFromInput(input);

  const grey = image.grey();
  const mask = grey.mask({ threshold, invert: true });
  const processedMask = dilationRadius > 0 ? mask.dilate({ kernel: buildSquareKernel(dilationRadius) }) : mask;
  const allowCorners = options.connectivity !== 4;

  return extractBlocksFromMask(processedMask, {
    allowCorners,
    minSurface: options.minSurface,
    maxSurface: options.maxSurface,
  });
}

export default imageToConnectedComponents;
