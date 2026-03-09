# EduNexus 时间戳显示功能实现

## 概述

为 EduNexus 的所有主要模块添加了时间戳显示功能，提供相对时间和绝对时间的智能展示。

## 实现内容

### 1. 时间格式化工具函数

**文件**: `apps/web/src/lib/utils/time-format.ts`

提供以下功能：
- `formatRelativeTime()` - 相对时间格式化（刚刚、5分钟前、今天 10:30、昨天 15:20、2024-03-09）
- `formatAbsoluteTime()` - 绝对时间格式化（2024-03-09 10:30:45）
- `formatDate()` - 自定义日期格式化
- `formatTime()` - 时间格式化（HH:mm）
- `formatTimeRange()` - 时间范围格式化
- `formatDuration()` - 持续时间格式化

### 2. 时间戳组件

**文件**: `apps/web/src/components/ui/timestamp.tsx`

提供两个组件：
- `<Timestamp>` - 单个时间戳显示，支持相对/绝对时间切换
- `<TimeRange>` - 时间范围显示（创建时间 + 更新时间）

特性：
- 鼠标悬停显示完整时间（Tooltip）
- 可选图标显示
- 自定义样式支持

### 3. 各模块时间戳集成

#### 学习工作区 (/workspace)
**文件**: `apps/web/src/app/workspace/page.tsx`

添加时间戳：
- ✅ 会话列表：显示创建时间和最后更新时间
- ✅ 消息时间戳：相对时间显示（刚刚、5分钟前等）
- ✅ Tooltip 显示完整时间

#### 知识库 (/kb)
**文件**: `apps/web/src/app/kb/page.tsx`

添加时间戳：
- ✅ 文档创建时间
- ✅ 文档最后修改时间
- ✅ 显示在文档详情页

#### 学习路径 (/path)
**文件**: `apps/web/src/app/path/page.tsx`

添加时间戳：
- ✅ 路径创建时间
- ✅ 任务创建时间
- ✅ 任务开始时间
- ✅ 任务完成时间

#### 教师工作台 (/teacher)
**文件**: `apps/web/src/app/teacher/page.tsx`

添加时间戳：
- ✅ 课程创建时间
- ✅ 作业发布时间
- ✅ 作业截止时间
- ✅ 学生提交时间

#### 配置中心 (/settings)
**文件**: `apps/web/src/components/settings/import-audit-log-panel.tsx`

添加时间戳：
- ✅ 审计日志时间戳（相对时间）
- ✅ Tooltip 显示完整时间

## 时间格式规则

### 相对时间显示规则

| 时间差 | 显示格式 | 示例 |
|--------|---------|------|
| < 1分钟 | 刚刚 | 刚刚 |
| < 1小时 | X分钟前 | 5分钟前 |
| 今天 | 今天 HH:mm | 今天 10:30 |
| 昨天 | 昨天 HH:mm | 昨天 15:20 |
| 本周内 | 周X HH:mm | 周三 14:30 |
| 今年内 | MM-DD HH:mm | 03-09 10:30 |
| 其他 | YYYY-MM-DD | 2024-03-09 |

### 绝对时间格式

- 完整格式：`YYYY-MM-DD HH:mm:ss`
- 简化格式：`YYYY-MM-DD HH:mm`

## 使用示例

### 基础用法

```tsx
import { Timestamp } from "@/components/ui/timestamp";

// 显示相对时间
<Timestamp date={new Date()} />

// 显示绝对时间
<Timestamp date={new Date()} relative={false} />

// 不显示图标
<Timestamp date={new Date()} showIcon={false} />
```

### 时间范围显示

```tsx
import { TimeRange } from "@/components/ui/timestamp";

<TimeRange
  createdAt={createdDate}
  updatedAt={updatedDate}
/>
```

### 直接使用工具函数

```tsx
import { formatRelativeTime, formatAbsoluteTime } from "@/lib/utils/time-format";

const relativeTime = formatRelativeTime(new Date());
const absoluteTime = formatAbsoluteTime(new Date());
```

## 技术特点

1. **纯 JavaScript 实现**：无需额外依赖库（date-fns/dayjs）
2. **智能时间显示**：根据时间差自动选择最合适的显示格式
3. **国际化支持**：中文时间格式
4. **Tooltip 增强**：鼠标悬停显示完整时间信息
5. **类型安全**：完整的 TypeScript 类型定义
6. **可复用组件**：统一的时间戳显示组件

## 数据类型更新

各模块的数据类型已更新，添加时间字段：

- `Session`: 添加 `createdAt`, `updatedAt`
- `Message`: 已有 `timestamp`
- `Document`: 已有 `createdAt`, `updatedAt`
- `Task`: 添加 `createdAt`, `startedAt`, `completedAt`
- `Course`: 添加 `createdAt`
- `Assignment`: 添加 `publishedAt`, `submittedAt`
- `AuditLog`: `timestamp` 改为 `Date` 类型

## 后续优化建议

1. **自动更新**：添加定时器自动更新相对时间显示
2. **时区支持**：支持不同时区的时间显示
3. **自定义格式**：允许用户自定义时间显示格式
4. **性能优化**：对大量时间戳使用虚拟滚动
5. **国际化**：支持多语言时间格式

## 测试建议

1. 测试不同时间差的显示格式
2. 测试 Tooltip 交互
3. 测试边界情况（跨天、跨周、跨年）
4. 测试性能（大量时间戳渲染）

## 注意事项

- 所有时间戳使用 `Date` 对象，确保类型一致
- Tooltip 组件需要 `@radix-ui/react-tooltip` 依赖
- 时间格式化函数考虑了中国时区和习惯
