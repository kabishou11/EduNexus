# 练习题库管理系统

完整的练习题库管理系统，支持题目创建、练习、错题本和 AI 生成题目。

## 功能特性

### 1. 数据模型
- **题库表（QuestionBank）**: 管理题库信息
- **题目表（Question）**: 支持多种题型
  - 选择题（Multiple Choice）
  - 填空题（Fill in Blank）
  - 简答题（Short Answer）
  - 编程题（Coding）
- **练习记录表（PracticeRecord）**: 记录练习历史
- **错题本表（WrongQuestion）**: 管理错题

### 2. 核心功能

#### 题库管理
- 创建、编辑、删除题库
- 题库分类和标签
- 题目数量统计

#### 题目管理
- CRUD 操作
- 题目分类和标签
- 难度分级（简单、中等、困难）
- 题目状态管理（激活、归档、草稿）
- 随机抽题算法

#### 练习模式
- 随机抽题练习
- 实时答题和评分
- 计时功能
- 答案解析
- 提示系统

#### 错题本
- 自动收集错题
- 错题笔记
- 掌握状态标记
- 错题复习

#### AI 题目生成
- 基于文档内容生成题目
- 支持指定题型和难度
- 批量生成和选择
- 自动生成答案解析

### 3. 技术架构

#### 前端
- **框架**: Next.js 14 + React
- **UI 组件**: Radix UI + Tailwind CSS
- **状态管理**: React Hooks
- **本地存储**: IndexedDB

#### 后端
- **API**: Next.js API Routes
- **验证**: Zod Schema
- **AI 服务**: ModelScope API

#### 数据存储
- **客户端**: IndexedDB（离线优先）
- **数据库**:
  - `EduNexusPractice` 数据库
  - 4 个对象存储：question_banks, questions, practice_records, wrong_questions

## 文件结构

\`\`\`
apps/web/src/
├── lib/
│   ├── client/
│   │   └── practice-storage.ts          # IndexedDB 存储管理
│   └── server/
│       └── schema.ts                     # API 验证 Schema
├── app/
│   ├── api/practice/
│   │   ├── banks/                        # 题库 API
│   │   ├── questions/                    # 题目 API
│   │   ├── generate/                     # AI 生成 API
│   │   ├── submit/                       # 提交答案 API
│   │   ├── mistakes/                     # 错题本 API
│   │   └── statistics/                   # 统计 API
│   └── workspace/practice/
│       ├── questions/                    # 题库管理页面
│       │   ├── page.tsx                  # 题库列表
│       │   └── [bankId]/page.tsx         # 题库详情
│       ├── drill/page.tsx                # 练习模式
│       ├── mistakes/page.tsx             # 错题本
│       └── generate/[bankId]/page.tsx    # AI 生成
└── components/practice/
    ├── question-list.tsx                 # 题目列表组件
    ├── question-editor.tsx               # 题目编辑器
    └── question-renderer.tsx             # 题目渲染器
\`\`\`

## API 端点

### 题库管理
- `GET /api/practice/banks` - 获取所有题库
- `POST /api/practice/banks` - 创建题库
- `GET /api/practice/banks/[id]` - 获取单个题库
- `PUT /api/practice/banks/[id]` - 更新题库
- `DELETE /api/practice/banks/[id]` - 删除题库

### 题目管理
- `GET /api/practice/questions?bankId=xxx` - 获取题库题目
- `POST /api/practice/questions` - 创建题目
- `GET /api/practice/questions/[id]` - 获取单个题目
- `PUT /api/practice/questions/[id]` - 更新题目
- `DELETE /api/practice/questions/[id]` - 删除题目
- `POST /api/practice/questions/random` - 随机抽题

### 练习和错题
- `POST /api/practice/submit` - 提交答案
- `GET /api/practice/mistakes?bankId=xxx` - 获取错题本
- `POST /api/practice/mistakes/[id]/master` - 标记已掌握
- `PUT /api/practice/mistakes/[id]` - 更新错题笔记
- `DELETE /api/practice/mistakes/[id]` - 删除错题

### AI 生成
- `POST /api/practice/generate` - 生成题目

### 统计
- `GET /api/practice/statistics?bankId=xxx` - 获取统计数据

## 使用方法

### 1. 创建题库
\`\`\`typescript
import { getPracticeStorage } from "@/lib/client/practice-storage";

const storage = getPracticeStorage();
const bank = await storage.createBank(
  "数学基础练习",
  "小学数学基础知识练习题库",
  ["数学", "基础"]
);
\`\`\`

### 2. 创建题目
\`\`\`typescript
await storage.createQuestion({
  bankId: bank.id,
  type: QuestionType.MULTIPLE_CHOICE,
  title: "1 + 1 = ?",
  content: "请选择正确答案",
  difficulty: QuestionDifficulty.EASY,
  status: QuestionStatus.ACTIVE,
  tags: ["加法"],
  points: 10,
  explanation: "1 + 1 = 2",
  options: [
    { id: "A", text: "1", isCorrect: false },
    { id: "B", text: "2", isCorrect: true },
    { id: "C", text: "3", isCorrect: false },
    { id: "D", text: "4", isCorrect: false },
  ],
});
\`\`\`

### 3. 随机抽题
\`\`\`typescript
const questions = await storage.getRandomQuestions(
  bankId,
  10,
  {
    difficulty: QuestionDifficulty.MEDIUM,
    tags: ["代数"],
  }
);
\`\`\`

### 4. 提交答案
\`\`\`typescript
await storage.createRecord({
  questionId: question.id,
  bankId: bank.id,
  answer: "B",
  isCorrect: true,
  score: 10,
  timeSpent: 30,
  attemptCount: 1,
});
\`\`\`

### 5. AI 生成题目
\`\`\`typescript
const response = await fetch("/api/practice/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bankId: bank.id,
    documentContent: "文档内容...",
    count: 5,
    difficulty: "medium",
  }),
});
\`\`\`

## 页面路由

- `/workspace/practice/questions` - 题库列表
- `/workspace/practice/questions/[bankId]` - 题库详情
- `/workspace/practice/drill?bankId=xxx` - 练习模式
- `/workspace/practice/mistakes?bankId=xxx` - 错题本
- `/workspace/practice/generate/[bankId]` - AI 生成题目

## 数据模型

### QuestionBank
\`\`\`typescript
{
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  questionCount: number;
}
\`\`\`

### Question
\`\`\`typescript
{
  id: string;
  bankId: string;
  type: QuestionType;
  title: string;
  content: string;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  tags: string[];
  points: number;
  timeLimit?: number;
  explanation?: string;
  hints?: string[];
  // 题型特定字段
  options?: MultipleChoiceOption[];
  blanks?: string[];
  testCases?: { input: string; expectedOutput: string }[];
  starterCode?: string;
}
\`\`\`

### PracticeRecord
\`\`\`typescript
{
  id: string;
  questionId: string;
  bankId: string;
  answer: string;
  isCorrect: boolean;
  score: number;
  timeSpent: number;
  attemptCount: number;
  createdAt: Date;
}
\`\`\`

### WrongQuestion
\`\`\`typescript
{
  id: string;
  questionId: string;
  bankId: string;
  wrongCount: number;
  lastWrongAt: Date;
  notes?: string;
  isMastered: boolean;
  masteredAt?: Date;
}
\`\`\`

## 特性说明

### 离线优先
所有数据存储在浏览器 IndexedDB 中，支持完全离线使用。

### 智能抽题
支持按题型、难度、标签过滤，随机打乱顺序。

### 自动错题收集
答错的题目自动添加到错题本，记录错误次数。

### AI 辅助
基于文档内容自动生成高质量题目，支持多种题型。

### 统计分析
提供详细的练习统计，包括正确率、平均分、用时等。

## 扩展建议

1. **导入导出**: 支持题库导入导出（JSON/Excel）
2. **题目模板**: 预设常用题型模板
3. **协作功能**: 支持题库分享和协作编辑
4. **学习曲线**: 根据练习记录生成学习曲线
5. **智能推荐**: 基于错题推荐相关题目
6. **打印功能**: 支持题目打印和 PDF 导出
7. **多媒体支持**: 题目中支持图片、音频、视频
8. **代码执行**: 编程题支持在线运行和测试

## 注意事项

1. IndexedDB 有存储限制，大量题目可能需要考虑云端存储
2. AI 生成的题目需要人工审核和调整
3. 编程题的自动评分需要安全的代码执行环境
4. 简答题需要人工评分或使用 AI 辅助评分
