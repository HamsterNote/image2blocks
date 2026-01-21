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
