import { Image as ImageJs } from 'image-js';
// const Image = ''
import imageToConnectedComponents, { ProcessOptions, ConnectedComponent } from '../index';

type Step = 'Original' | 'Grey' | 'Mask' | 'Dilated' | 'Components';
const steps: Step[] = ['Original', 'Grey', 'Mask', 'Dilated', 'Components'];

const fileInput = document.getElementById('file') as HTMLInputElement;
const thresholdInput = document.getElementById('threshold') as HTMLInputElement;
const dilationInput = document.getElementById('dilation') as HTMLInputElement;
const connectivitySelect = document.getElementById('connectivity') as HTMLSelectElement;
const prevBtn = document.getElementById('prev') as HTMLButtonElement;
const nextBtn = document.getElementById('next') as HTMLButtonElement;
const stepLabel = document.getElementById('step') as HTMLSpanElement;
const boxesInfo = document.getElementById('boxes') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let currentStep = 0;
let currentImage: ImageJs | null = null;
let grey: ImageJs | null = null;
let mask: ImageJs | null = null;
let dilated: ImageJs | null = null;
let components: ConnectedComponent[] = [];
let htmlImageEl: HTMLImageElement | null = null;

type DilateCapable = {
  dilate: (options: { iterations: number }) => ImageJs;
};

type ImageCanvasProvider = ImageJs & {
  getCanvas?: () => HTMLCanvasElement;
  toDataURL?: () => string;
};

function hasDilate(value: unknown): value is DilateCapable {
  return typeof (value as { dilate?: unknown }).dilate === 'function';
}

async function loadFromFile(file: File): Promise<void> {
  const url = URL.createObjectURL(file);
  // Keep an HTMLImageElement for drawing the original easily
  htmlImageEl = await new Promise((resolve, reject) => {
    const img = new Image() as HTMLImageElement;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  currentImage = await ImageJs.load(url);
  await recompute();
  URL.revokeObjectURL(url);
}

function getOptions(): ProcessOptions {
  const threshold = Number(thresholdInput.value || 128);
  const dilationRadius = Number(dilationInput.value || 0);
  const connectivity = Number(connectivitySelect.value) as 4 | 8;
  return { threshold, dilationRadius, connectivity };
}

async function recompute(): Promise<void> {
  if (!currentImage) return;
  const { threshold, dilationRadius, connectivity } = getOptions();

  // Compute intermediates
  grey = currentImage.grey();
  // By default, mask() considers light pixels as foreground (1) and dark as background (0).
  // We want to expand dark content (e.g., black text), so invert the mask so dark becomes foreground.
  mask = grey.mask({ threshold, invert: true });

  if (dilationRadius && hasDilate(mask)) {
    // Using iterations to approximate radius in our library function
    // dilated = mask.dilate({ iterations: dilationRadius, kernel: [[0, 1, 0], [0, 1, 0], [0, 0, 0]] });
    dilated = mask.dilate({ iterations: dilationRadius });
  } else {
    dilated = mask;
  }

  // Components from our library on the processed mask pipeline by passing same inputs
  components = await imageToConnectedComponents(currentImage.getCanvas(), {
    threshold,
    dilationRadius,
    connectivity,
  });

  draw();
}

function resizeCanvasFor(imgWidth: number, imgHeight: number) {
  const maxW = Math.min(window.innerWidth - 60, 1200);
  const ratio = Math.min(1, maxW / imgWidth);
  canvas.width = Math.round(imgWidth * ratio);
  canvas.height = Math.round(imgHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawImageToCanvas(image: HTMLImageElement | ImageJs) {
  const { width, height } = image;
  resizeCanvasFor(width, height);
  if (image instanceof HTMLImageElement) {
    ctx.drawImage(image, 0, 0);
  } else {
    // image-js Image -> draw via its internal canvas
    const imageWithCanvas = image as ImageCanvasProvider;
    const innerCanvas = imageWithCanvas.getCanvas?.();
    if (innerCanvas) {
      ctx.drawImage(innerCanvas, 0, 0);
    } else {
      // Fallback: toDataURL
      const dataURL = imageWithCanvas.toDataURL?.();
      if (dataURL) {
        const tmp = new Image();
        tmp.onload = () => ctx.drawImage(tmp, 0, 0);
        tmp.src = dataURL;
      }
    }
  }
}

function drawBoxes() {
  if (!components) return;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ff5252';
  components.forEach(c => {
    ctx.strokeRect(c.bbox.x, c.bbox.y, c.bbox.width, c.bbox.height);
  });
  ctx.restore();
}

function draw() {
  boxesInfo.textContent = '';
  if (!currentImage || !htmlImageEl) return;
  const step = steps[currentStep];
  stepLabel.textContent = step;

  switch (step) {
    case 'Original':
      drawImageToCanvas(htmlImageEl);
      break;
    case 'Grey':
      drawImageToCanvas(grey!);
      break;
    case 'Mask':
      drawImageToCanvas(mask!);
      break;
    case 'Dilated':
      drawImageToCanvas(dilated!);
      break;
    case 'Components':
      drawImageToCanvas(htmlImageEl);
      drawBoxes();
      boxesInfo.textContent = `组件数量 components: ${components.length}`;
      break;
  }
}

function changeStep(delta: number) {
  currentStep = (currentStep + delta + steps.length) % steps.length;
  draw();
}

// Events
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (file) {
    await loadFromFile(file);
  }
});

[thresholdInput, dilationInput, connectivitySelect].forEach(el => {
  el.addEventListener('input', () => {
    recompute();
  });
});

prevBtn.addEventListener('click', () => changeStep(-1));
nextBtn.addEventListener('click', () => changeStep(1));

// If user drops an image on the page
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (file) loadFromFile(file);
});
