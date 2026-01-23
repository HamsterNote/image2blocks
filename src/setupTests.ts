import { TextDecoder, TextEncoder } from 'node:util';

const NodeTextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
const NodeTextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = NodeTextDecoder;
}

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = NodeTextEncoder;
}
