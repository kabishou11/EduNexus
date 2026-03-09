# 🚀 EduNexus Agent 快速参考

## 启动项目
```bash
pnpm dev
```

## 访问地址
- 工作区: http://localhost:3000/workspace
- 总览: http://localhost:3000/dashboard
- 知识库: http://localhost:3000/kb
- 配置: http://localhost:3000/settings

## 运行测试
```bash
# Windows
./test-agent.ps1

# Linux/Mac
./test-agent.sh
```

## API 端点
```bash
# 测试连接
GET /api/test/modelscope

# 获取模型列表
GET /api/models/list

# Agent 对话
POST /api/workspace/agent/chat
{
  "message": "你的问题",
  "history": [],
  "config": {
    "socraticMode": true,
    "temperature": 0.7
  }
}

# 流式对话
POST /api/workspace/agent/stream

# 知识库 AI
POST /api/kb/ai/chat
```

## 环境变量
```bash
# .env.local
NEXT_PUBLIC_AI_PROVIDER=modelscope
MODELSCOPE_API_KEY=your_key
MODELSCOPE_CHAT_MODEL=Qwen/Qwen3-8B
```

## 工作模式
- **苏格拉底模式**: 引导式提问，培养思考能力
- **直接教学模式**: 直接解答，快速获取知识

## 可用工具
1. 搜索知识库
2. 查询知识图谱
3. 生成练习题 ✅ AI
4. 推荐学习路径 ✅ AI
5. 解释概念 ✅ AI
6. 苏格拉底式提问 ✅ AI
7. 检查理解程度 ✅ AI

## 快捷操作
- 解释概念: "请解释一下..."
- 生成练习: "我想练习..."
- 学习路径: "我想学习..."
- 检查理解: "测试我对...的理解"

## 文档
- TASKS_COMPLETED.md - 任务完成总结
- WORKSPACE_AGENT_ARCHITECTURE.md - 架构文档
- WORKSPACE_AGENT_QUICKSTART.md - 快速开始
- AGENT_INTEGRATION_PLAN.md - 集成规划
- MODELSCOPE_GUIDE.md - ModelScope 指南

## 故障排除
- Agent 响应慢 → 减少 maxIterations
- API 调用失败 → 检查 API Key
- 前端报错 → 查看浏览器控制台

## 提交记录
- b9591c5: 五项任务完成总结
- 9afb06e: Agent 全面集成与测试
- 1282a17: React Agent 架构实现
- fc8d092: Agent 快速开始指南

## 下一步
1. 测试 Agent 功能
2. 体验双工作模式
3. 查看思考过程
4. 尝试不同工具
5. 规划其他页面集成
