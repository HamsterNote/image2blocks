# Phase 1 Data Model

## Entities

### ImageInput

- **Description**: 用户提供的图像数据。
- **Accepted Forms**: base64 字符串、File、ArrayBuffer。
- **Validation Rules**:
  - 必须是上述三种输入之一。
  - 字符串输入必须可被识别为有效图像数据。

### Block

- **Description**: 表示一个连通区域的检测结果。
- **Fields**:
  - `id`: 唯一标识（仅用于结果区分）。
  - `bbox`: 外包围盒信息。
  - `area` (optional): 区域面积或像素数量。
- **Validation Rules**:
  - `bbox` 必须完整，且宽高为正数。

### Box

- **Description**: 外包围盒，用于描述位置与尺寸。
- **Fields**:
  - `x`: 左上角横坐标。
  - `y`: 左上角纵坐标。
  - `width`: 宽度。
  - `height`: 高度。
- **Validation Rules**:
  - `width` 与 `height` 必须大于 0。

### DetectionParams

- **Description**: 控制检测行为的参数集合。
- **Fields**:
  - `threshold`: 阈值，范围 0-255。
  - `dilationRadius`: 膨胀半径，非负整数。
- **Validation Rules**:
  - `threshold` 超出范围时应返回可理解错误。
  - `dilationRadius` 为负数时应返回可理解错误。

## Relationships

- `ImageInput` 经过处理生成 `Block[]`。
- `Block` 包含一个 `Box`。
