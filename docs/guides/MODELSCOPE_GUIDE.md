# ModelScope AI 集成使用指南

## 快速开始

### 1. 获取 API Key

访问 [ModelScope](https://modelscope.cn) 并注册账号，然后在个人中心获取 API Key。

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# AI 提供商设置为 modelscope
NEXT_PUBLIC_AI_PROVIDER=modelscope

# ModelScope API 配置
MODELSCOPE_API_KEY=your_api_key_here
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
MODELSCOPE_CHAT_MODEL=Qwen/Qwen3-8B
```

### 3. 在配置中心选择模型

1. 启动项目：`pnpm dev`
2. 访问配置中心：`http://localhost:3000/settings`
3. 点击"模型配置"标签
4. 输入 API Key
5. 点击"刷新"按钮获取最新模型列表
6. 选择想要使用的模型
7. 调整参数（Temperature、Top P、Max Tokens）
8. 点击"保存配置"

### 4. 使用 AI 助手

在知识库页面（`/kb`）：
1. 创建或打开一个文档
2. 点击右下角紫色星星按钮
3. 选择快捷操作或输入自定义问题
4. AI 助手会基于文档内容生成回复

## 支持的模型

### Qwen3 系列（推荐）
- **Qwen/Qwen3-8B** - 平衡性能与速度，推荐日常使用
- **Qwen/Qwen3-4B** - 快速响应，适合简单任务
- **Qwen/Qwen3-14B** - 更强理解能力
- **Qwen/Qwen3-32B** - 顶级性能，复杂任务

### DeepSeek 系列
- **deepseek-ai/DeepSeek-R1** - 强大的逻辑推理能力
- **deepseek-ai/DeepSeek-V3.2** - 最新版本

### GLM 系列
- **THUDM/glm-4-9b-chat** - 智谱 GLM-4 对话模型

## API 端点

### 获取模型列表
```bash
GET /api/models/list
```

返回：
```json
{
  "success": true,
  "models": [
    {
      "id": "Qwen/Qwen3-8B",
      "name": "Qwen3-8B",
      "description": "通义千问 3 代 8B 模型",
      "provider": "ModelScope"
    }
  ],
  "total": 7
}
```

### AI 聊天
```bash
POST /api/kb/ai/chat
Content-Type: application/json

{
  "documentTitle": "文档标题",
  "documentContent": "文档内容",
  "selectedText": "选中的文本",
  "userInput": "用户问题",
  "conversationHistory": []
}
```

## 配置参数说明

### Temperature (0-2)
- **0.0-0.3**: 确定性输出，适合事实性任务
- **0.4-0.7**: 平衡创造性和准确性（推荐）
- **0.8-1.0**: 更有创造性，适合写作
- **1.0+**: 高度随机，实验性

### Top P (0-1)
- **0.9-1.0**: 考虑更多可能性（推荐）
- **0.5-0.8**: 更聚焦的输出
- **0.1-0.4**: 非常确定的输出

### Max Tokens
- **100-500**: 简短回复
- **500-1000**: 中等长度（推荐）
- **1000-2000**: 详细回复
- **2000-4000**: 长文本生成

## 故障排除

### 问题：模型列表加载失败
**解决方案**：
1. 检查 API Key 是否正确
2. 检查网络连接
3. 系统会自动使用默认模型列表

### 问题：AI 调用失败
**解决方案**：
1. 检查环境变量配置
2. 确认 API Key 有效
3. 系统会自动降级到模拟模式

### 问题：响应速度慢
**解决方案**：
1. 选择较小的模型（如 Qwen3-4B）
2. 减少 Max Tokens 设置
3. 检查网络延迟

## 开发模式

如果没有 API Key，系统会自动使用模拟模式：

```bash
NEXT_PUBLIC_AI_PROVIDER=mock
```

模拟模式提供基于关键词的响应，适合开发和测试。

## 生产部署

1. 在生产环境设置环境变量
2. 使用环境变量管理工具（如 Vercel、Railway）
3. 不要在代码中硬编码 API Key
4. 定期轮换 API Key

## 成本优化

1. 使用较小的模型处理简单任务
2. 合理设置 Max Tokens
3. 实现请求缓存
4. 监控 API 使用量

## 更多信息

- [ModelScope 文档](https://modelscope.cn/docs)
- [API 参考](https://api-inference.modelscope.cn/docs)
- [模型列表](https://modelscope.cn/models)
