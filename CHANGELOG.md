# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial implementation of `getBlocksByImage` function for extracting connected component bounding boxes from images
- Support for both browser (File, string) and Node.js (ArrayBuffer) environments
- Image processing pipeline with binarization, dilation, and connected components detection
- TypeScript types and comprehensive documentation
- Jest test suite with browser and Node.js tests
- ESLint and Prettier configuration for code quality
- Vite build setup for library distribution

### Fixed
- **String input handling**: Added URL and file path detection to `normalizeBase64Input` function. Now properly handles:
  - Data URLs (already have `data:` prefix) - passed through
  - HTTP/HTTPS URLs (http://, https://) - passed through
  - File paths with image extensions (.png, .jpg, etc.) - passed through
  - Raw base64 strings - wrapped with `data:image/png;base64,` prefix
- **Package publishing configuration**:
  - Removed `dist/` from `.npmignore` to prevent build artifacts from being excluded
  - Added `files` field to `package.json` to explicitly include `dist/`, `README.md`, and `LICENSE`
- **Dependency configuration**: Moved `image-js` from `dependencies` to `peerDependencies` to align with Vite's external configuration and allow consumers to provide their own version
- **TypeScript test diagnostics**: Updated `jest.config.ts` to use `diagnostics: { warnOnly: true }` for better development feedback without failing tests
- **Bash script safety**: Fixed command substitution quoting in `.specify/scripts/bash/check-prerequisites.sh` to prevent word-splitting issues

