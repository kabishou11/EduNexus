# EduNexus

> 智能教育生态平台 - 让学习更高效

EduNexus 是一个基于 Web 的 AI 驱动教育平台，集成知识管理、学习路径规划、智能问答等功能，帮助学习者构建个性化的学习体系。

## ✨ 核心功能

### 📚 知识宝库
- **富文本编辑器**：基于 Tiptap 的强大编辑体验
- **AI 智能摘要**：自动生成文档摘要
- **AI 思维导图**：智能分析文档结构，生成可视化思维导图
- **反向链接**：自动发现文档间的关联关系
- **标签系统**：灵活的知识分类管理

### 🎯 学习路径
- **路径市场**：浏览和订阅学习路径
- **路径编辑器**：创建自定义学习路径
- **路径执行器**：跟踪学习进度
- **AI 学习建议**：智能推荐学习内容

### 👥 学习小组
- **小组讨论**：实时协作交流
- **小组推荐**：智能匹配学习伙伴
- **邀请码分享**：便捷的小组加入方式

### 📊 资源中心
- **资源上传**：支持多种文件格式
- **智能推荐**：基于学习历史的个性化推荐
- **资源筛选**：按类型、标签快速查找

### 🤖 全局 AI 助手
- **写作助手**：智能辅助内容创作
- **学习指导**：个性化学习建议
- **文档感知**：自动识别当前文档上下文
- **快捷唤起**：Cmd/Ctrl + K 快速调用

### 🎮 成长系统
- **用户等级**：基于学习活动的等级体系
- **徽章系统**：成就激励机制
- **学习统计**：可视化学习数据

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
复制 `.env.example` 为 `.env.local`，并配置必要的环境变量：

```bash
cp .env.example .env.local
```

### 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000 查看应用。

## 🔧 配置中心

首次使用需要在配置中心设置 ModelScope API Key：

1. 访问 http://localhost:3000/settings
2. 进入"模型配置"
3. 填写 ModelScope API Key（在 [ModelScope](https://modelscope.cn) 获取）
4. 点击"保存配置"

配置完成后，所有 AI 功能（思维导图、智能摘要、全局 AI 助手）将正常工作。

## 📁 项目结构

```
EduNexus/
├── apps/
│   └── web/              # Next.js 主应用
│       ├── src/
│       │   ├── app/      # 页面路由
│       │   ├── components/  # React 组件
│       │   └── lib/      # 工具库
│       └── public/       # 静态资源
├── packages/             # 共享包
└── README.md
```

## 🛠️ 技术栈

- **框架**：Next.js 14 (App Router)
- **UI 库**：React 18 + shadcn/ui
- **样式**：Tailwind CSS
- **编辑器**：Tiptap
- **数据存储**：IndexedDB (Dexie.js)
- **AI 模型**：ModelScope API
- **动画**：Framer Motion
- **图表**：ReactFlow

## 📝 主要页面

- `/` - 首页
- `/kb` - 知识宝库
- `/path` - 学习路径
- `/groups` - 学习小组
- `/resources` - 资源中心
- `/workspace` - 学习工作区
- `/settings` - 配置中心

## 🔐 安全说明

- 严禁提交真实 API Key 到仓库
- 使用 `.env.local` 存储敏感信息
- `.env.local` 已在 `.gitignore` 中排除

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
