# EduNexus 知识库 AI 助手功能

## 功能概述

为 EduNexus 知识库页面添加了智能 AI 对话助手，帮助用户更高效地创作和管理知识内容。

## 核心功能

### 1. AI 助手面板
- **位置**: 右下角浮动按钮，点击展开对话面板
- **可折叠**: 支持最小化和展开
- **上下文感知**: 自动关联当前打开的文档

### 2. AI 功能

#### 文档摘要生成
- 快速生成文档的简洁摘要
- 提取关键要点
- 适合快速了解文档内容

#### 内容扩展建议
- 帮助扩展现有内容
- 添加更多细节和说明
- 提供写作方向建议

#### 相关概念解释
- 解释文档中的专业术语
- 提供背景知识
- 支持选中文本进行解释

#### 写作改进建议
- 优化文字表达
- 改进文章结构
- 提升可读性

### 3. 上下文感知

AI 助手可以访问：
- **当前文档内容**: 理解文档的整体内容
- **选中的文本**: 针对特定段落提供帮助
- **文档标题**: 了解文档主题
- **对话历史**: 保持上下文连贯性

### 4. UI 组件

#### 快捷操作按钮
- 生成摘要
- 扩展内容
- 解释概念
- 改进写作

#### 对话界面
- 用户消息（紫色气泡）
- AI 回复（白色气泡）
- 加载状态指示

#### 插入功能
- AI 回复可直接插入到文档中
- 点击"插入到文档"按钮即可

## 技术实现

### 前端组件

**文件**: `apps/web/src/components/kb/ai-assistant.tsx`

主要功能：
- 对话界面管理
- 消息历史记录
- 快捷建议生成
- 文本插入功能

### API 路由

**文件**: `apps/web/src/app/api/kb/ai/chat/route.ts`

功能：
- 接收用户输入和文档上下文
- 调用 AI 模型生成响应
- 返回格式化的回复

### 集成位置

**文件**: `apps/web/src/app/kb/page.tsx`

集成方式：
```tsx
<AIAssistant
  documentId={selectedDoc?.id}
  documentTitle={selectedDoc?.title}
  documentContent={selectedDoc?.content}
  selectedText={selectedText}
  onInsertText={(text) => {
    if (isEditing) {
      setEditContent((prev) => prev + "\n\n" + text);
    }
  }}
/>
```

## 使用方法

### 基本使用

1. **打开 AI 助手**
   - 点击右下角的紫色浮动按钮（星星图标）

2. **选择快捷操作**
   - 点击预设的快捷按钮（生成摘要、扩展内容等）
   - 或直接输入自定义问题

3. **查看 AI 回复**
   - AI 会基于文档内容生成回复
   - 回复会显示在对话框中

4. **插入到文档**
   - 点击 AI 回复下方的"插入到文档"按钮
   - 内容会自动添加到编辑器中

### 高级功能

#### 选中文本提问
1. 在编辑器或预览模式中选中文本
2. 打开 AI 助手
3. 使用"解释概念"快捷按钮或自定义提问

#### 多轮对话
- AI 助手会记住最近 6 轮对话
- 可以进行连续的问答
- 保持上下文连贯性

## API 集成

### 请求格式

```typescript
POST /api/kb/ai/chat

{
  "documentId": "doc_123",           // 可选
  "documentTitle": "文档标题",        // 可选
  "documentContent": "文档内容...",   // 可选
  "selectedText": "选中的文本",       // 可选
  "userInput": "用户问题",            // 必需
  "conversationHistory": [           // 可选
    {
      "role": "user",
      "content": "之前的问题"
    },
    {
      "role": "assistant",
      "content": "之前的回答"
    }
  ]
}
```

### 响应格式

```typescript
{
  "data": {
    "response": "AI 生成的回复内容",
    "timestamp": "2026-03-09T12:00:00.000Z"
  }
}
```

## 扩展建议

### 集成真实 AI 模型

当前实现使用模拟响应。要集成真实的 AI 模型：

1. **OpenAI GPT**
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: messages
});
```

2. **Anthropic Claude**
```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  messages: messages
});
```

3. **本地模型**
- 使用 Ollama 运行本地模型
- 集成 LangChain 进行模型管理

### 增强功能

1. **流式响应**
   - 实现 Server-Sent Events (SSE)
   - 逐字显示 AI 回复
   - 提升用户体验

2. **向量搜索**
   - 集成向量数据库（如 Pinecone、Weaviate）
   - 基于语义搜索相关文档
   - 提供更准确的上下文

3. **多文档关联**
   - 分析双链关系
   - 提供跨文档的见解
   - 构建知识图谱

4. **个性化建议**
   - 学习用户写作风格
   - 提供定制化建议
   - 记住用户偏好

## 测试

运行测试：
```bash
pnpm test apps/web/src/app/api/kb/ai/chat/route.test.ts
```

## 设计参考

- **Notion AI**: 智能写作助手
- **Obsidian Copilot**: 知识库 AI 插件
- **ChatGPT**: 对话界面设计

## 注意事项

1. **隐私保护**: 确保用户文档内容的隐私安全
2. **API 限流**: 实现请求频率限制
3. **错误处理**: 优雅处理 AI 服务不可用的情况
4. **成本控制**: 监控 AI API 调用成本

## 未来规划

- [ ] 集成真实 AI 模型（OpenAI/Anthropic）
- [ ] 实现流式响应
- [ ] 添加向量搜索功能
- [ ] 支持多语言
- [ ] 添加语音输入
- [ ] 实现协作编辑建议
