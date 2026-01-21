# Tasks: 图像连通域块提取

**Input**: Design documents from `/specs/002-image-blocks/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 本功能要求新增测试（来自需求“尝试写一系列的单元测试”）。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Review existing exports and test layout in src/index.ts and src/__tests__/base.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T002 Define public types for ImageInput/Block/Box/DetectionParams in src/index.ts
- [X] T003 Add shared validation helpers for threshold and dilationRadius in src/index.ts
- [X] T004 Ensure cross-runtime input normalization (base64/File/ArrayBuffer) is centralized in src/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 获取图像块列表 (Priority: P1) 🎯 MVP

**Goal**: 调用 getBlocksByImage 返回连通域外包围盒列表

**Independent Test**: 使用两块图像与空白图像输入，验证块数量与外包围盒正确性

### Tests for User Story 1 (REQUIRED)

- [X] T005 [P] [US1] Add node-canvas based fixtures and helpers in src/__tests__/helpers/canvas.ts
- [X] T006 [P] [US1] Add unit test for two-block image in src/__tests__/getBlocksByImage.test.ts
- [X] T007 [P] [US1] Add unit test for blank image returns empty list in src/__tests__/getBlocksByImage.test.ts
- [X] T008 [P] [US1] Add unit test for invalid input error in src/__tests__/getBlocksByImage.test.ts
- [X] T009 [P] [US1] Add unit test for tiny image handling in src/__tests__/getBlocksByImage.test.ts
- [X] T010 [P] [US1] Add regression expectations for standard fixtures in src/__tests__/getBlocksByImage.test.ts

### Implementation for User Story 1

- [X] T011 [US1] Implement getBlocksByImage base workflow in src/index.ts
- [X] T012 [US1] Map connected components to Block/Box output in src/index.ts
- [X] T013 [US1] Implement invalid input error handling in src/index.ts

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 调整阈值与膨胀半径 (Priority: P2)

**Goal**: 通过阈值与膨胀半径调整检测结果

**Independent Test**: 相同图像在不同参数下块数量/尺寸变化符合预期

### Tests for User Story 2 (REQUIRED)

- [X] T014 [P] [US2] Add unit test for threshold sensitivity in src/__tests__/getBlocksByImage.test.ts
- [X] T015 [P] [US2] Add unit test for dilationRadius behavior in src/__tests__/getBlocksByImage.test.ts

### Implementation for User Story 2

- [X] T016 [US2] Wire threshold and dilationRadius options in src/index.ts

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 跨环境一致性 (Priority: P3)

**Goal**: Node.js 与浏览器保持一致输入与输出行为

**Independent Test**: 同一输入在不同运行时输出结构一致

### Tests for User Story 3 (REQUIRED)

- [X] T017 [P] [US3] Add unit test for ArrayBuffer input in src/__tests__/getBlocksByImage.test.ts
- [X] T018 [P] [US3] Add unit test for base64 input in src/__tests__/getBlocksByImage.test.ts
- [X] T019 [P] [US3] Add browser-compat test for File input in src/__tests__/getBlocksByImage.browser.test.ts

### Implementation for User Story 3

- [X] T020 [US3] Support File input in src/index.ts (browser path)
- [X] T021 [US3] Support ArrayBuffer input in src/index.ts (node/browser path)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T022 [P] Document getBlocksByImage usage in README or export docs in README.md
- [X] T023 [P] Review API naming/defaults/errors for consistency in src/index.ts
- [X] T024 [P] Add performance benchmark for getBlocksByImage in src/__tests__/perf/getBlocksByImage.perf.ts and record results in specs/002-image-blocks/perf.md
- [X] T025 [P] Run quickstart.md validation against current API in specs/002-image-blocks/quickstart.md
- [ ] T026 Run full test suite and lint checks

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core implementation before integration

### Parallel Opportunities

- T005, T006, T007, T008, T009, T010 can run in parallel
- T014 and T015 can run in parallel
- T017 and T018 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add node-canvas based fixtures and helpers in src/__tests__/helpers/canvas.ts"
Task: "Add unit test for two-block image in src/__tests__/getBlocksByImage.test.ts"
Task: "Add unit test for blank image returns empty list in src/__tests__/getBlocksByImage.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (blocks all stories)
3. Complete Phase 3: User Story 1
4. Stop and validate User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
