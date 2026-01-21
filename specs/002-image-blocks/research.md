# Phase 0 Research

## Decision 1: 图像处理基础能力

- **Decision**: 继续基于现有依赖 `image-js` 进行图像加载、灰度化、二值化与连通域提取。
- **Rationale**: 项目已使用 `image-js` 并具备现成逻辑，能在 Node 与浏览器中工作，减少新依赖与风险。
- **Alternatives considered**:
  - 自研像素级连通域算法：成本高且维护复杂。
  - 引入新图像处理库：需要评估兼容性与体积，收益不明确。

## Decision 2: 输入类型支持范围

- **Decision**: 支持 base64 字符串、File、ArrayBuffer 作为输入类型，并保证 Node 与浏览器一致行为。
- **Rationale**: 与需求一致，覆盖最常见的前端与后端输入路径。
- **Alternatives considered**:
  - 仅支持 base64：限制浏览器文件上传与 Node 二进制流场景。
  - 仅支持 File/ArrayBuffer：增加与现有调用方式的迁移成本。

## Decision 3: 参数与默认值策略

- **Decision**: 提供阈值与膨胀半径参数，默认值采用当前库内既有行为，确保兼容与可预期。
- **Rationale**: 需求要求可配置，默认保持现有模式可降低行为变化风险。
- **Alternatives considered**:
  - 强制用户显式传入参数：增加使用成本。
  - 激进调整默认值：可能导致与现有输出不一致。
