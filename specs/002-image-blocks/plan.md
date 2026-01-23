# Implementation Plan: 图像连通域块提取

**Branch**: `002-image-blocks` | **Date**: 2026-01-21 | **Spec**: /home/zhangxiao/frontend/HamsterNote/image2blocks/specs/002-image-blocks/spec.md
**Input**: Feature specification from `/specs/002-image-blocks/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

为 Node.js 与浏览器提供统一的 `getBlocksByImage` 能力，支持 base64、File、ArrayBuffer 输入，输出连通域外包围盒列表，并支持阈值与膨胀半径参数；同时补充可重复的单元测试用例。

## Technical Context

**Language/Version**: TypeScript 5.6.3  
**Primary Dependencies**: image-js 0.35.5, Vite 5.4.10, Jest 29.7.0, ts-jest 29.2.5  
**Storage**: N/A  
**Testing**: Jest + ts-jest（node 环境），测试可能使用 node-canvas  
**Target Platform**: Node.js + 浏览器  
**Project Type**: 单一库（library）  
**Performance Goals**: 2000x2000 以内图像在 1 秒内得到结果（需记录性能验证结果）  
**Constraints**: 需同时兼容 Node 与浏览器，避免仅浏览器或仅 Node 的专用依赖  
**Scale/Scope**: 单次处理单张图像，返回块列表

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality: APIs documented, types safe, error handling intentional.
- Testing: new behavior covered by tests; regressions have explicit waivers.
- UX Consistency: public API/CLI changes reviewed for naming and outputs.
- Performance: budgets defined for critical paths and validated when modified.

## Project Structure

### Documentation (this feature)

```text
specs/002-image-blocks/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.ts
├── demo/
│   └── main.ts
└── __tests__/
    └── base.test.ts
```

**Structure Decision**: 单一库项目，源代码与测试均位于 `src/`，单元测试集中在 `src/__tests__/`。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无。

## Constitution Check (Post-Design)

- Code Quality: 设计文档明确对外接口与类型边界。
- Testing: 已规划基于绘制样例图像的单元测试覆盖新增行为。
- UX Consistency: 对外输出结构保持一致，并在 quickstart 中说明使用方式。
- Performance: 以 2000x2000/1 秒作为性能目标，后续实现需验证。
