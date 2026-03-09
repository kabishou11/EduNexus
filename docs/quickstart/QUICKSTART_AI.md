# 快速开始：AI 助手功能

## 立即体验（开发模式）

### 1. 启动项目
```bash
cd F:/1work/EduNexus
pnpm dev
```

### 2. 访问知识库页面
打开浏览器访问：`http://localhost:3000/kb`

### 3. 使用 AI 助手
1. 点击右下角的紫色星星按钮
2. 选择快捷操作或输入问题
3. 查看 AI 回复
4. 点击"插入到文档"将内容添加到编辑器

## 功能演示

### 场景 1：生成文档摘要
1. 打开任意文档
2. 点击 AI 助手按钮
3. 点击"生成摘要"
4. AI 会分析文档并生成摘要

### 场景 2：解释选中文本
1. 在文档中选中一段文字
2. 打开 AI 助手
3. 点击"解释概念"
4. AI 会解释选中的内容

### 场景 3：扩展内容
1. 打开文档
2. 点击 AI 助手
3. 点击"扩展内容"
4. AI 会提供扩展建议

### 场景 4：自定义提问
1. 打开 AI 助手
2. 在输入框输入问题，例如：
   - "如何改进这段文字？"
   - "这个概念的应用场景有哪些？"
   - "帮我添加一些示例"
3. 按 Enter 或点击发送按钮
4. 查看 AI 回复

## 当前状态

### ✅ 已实现
- AI 助手 UI 组件
- 对话功能
- 快捷操作
- 文本选择
- 内容插入
- 模拟 AI 响应

### 🔄 使用模拟模式
当前使用关键词匹配的模拟响应，无需配置 API 密钥即可体验完整功能。

## 升级到真实 AI

### 使用 OpenAI
1. 获取 OpenAI API 密钥
2. 在 `.env.local` 中配置：
```env
NEXT_PUBLIC_AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4
```
3. 重启项目

### 使用 Anthropic Claude
1. 获取 Anthropic API 密钥
2. 在 `.env.local` 中配置：
```env
NEXT_PUBLIC_AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-api-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```
3. 重启项目

### 使用本地模型（Ollama）
1. 安装并启动 Ollama
2. 在 `.env.local` 中配置：
```env
NEXT_PUBLIC_AI_PROVIDER=local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```
3. 重启项目

## 文件位置

### 核心文件
- **AI 助手组件**: `apps/web/src/components/kb/ai-assistant.tsx`
- **API 路由**: `apps/web/src/app/api/kb/ai/chat/route.ts`
- **配置文件**: `apps/web/src/lib/ai-config.ts`
- **服务集成**: `apps/web/src/lib/ai-service.ts`

### 文档
- **功能文档**: `KB_AI_ASSISTANT.md`
- **使用指南**: `AI_ASSISTANT_GUIDE.md`
- **实现总结**: `AI_IMPLEMENTATION_SUMMARY.md`

## 测试

运行测试：
```bash
pnpm test apps/web/src/app/api/kb/ai/chat/route.test.ts
```

## 常见问题

### Q: AI 助手按钮在哪里？
A: 在知识库页面的右下角，紫色的星星图标。

### Q: 为什么 AI 回复很简单？
A: 当前使用模拟模式，回复基于关键词匹配。配置真实 AI 模型后会有更智能的回复。

### Q: 如何插入 AI 回复到文档？
A: 点击 AI 回复下方的"插入到文档"按钮，内容会自动添加到编辑器末尾。

### Q: 可以选择文本提问吗？
A: 可以！在编辑器或预览模式中选中文本，AI 会自动识别并在回复中考虑选中的内容。

### Q: 对话历史会保存吗？
A: 当前对话历史保存在内存中，刷新页面后会清空。未来会添加持久化存储。

## 下一步

1. **体验功能**: 在开发环境中测试所有功能
2. **配置 AI**: 根据需要配置真实的 AI 模型
3. **自定义**: 修改提示词模板以适应特定需求
4. **扩展**: 添加更多快捷操作或自定义功能

## 反馈

如有问题或建议，请：
- 在 GitHub 提 Issue
- 联系开发团队
- 查看详细文档

---

**享受 AI 辅助写作的乐趣！** ✨
