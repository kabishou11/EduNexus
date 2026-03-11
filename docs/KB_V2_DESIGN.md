# EduNexus 知识库 V2 设计文档

## 概述

EduNexus 知识库 V2 是一个现代化的笔记应用，参考了 Notion、飞书文档和语雀等优秀产品的设计理念，提供流畅的编辑体验和强大的 AI 功能。

## 设计理念

### 1. 简洁优雅
- 采用三栏布局（左侧栏、编辑区、右侧面板）
- 可折叠的侧边栏，最大化编辑空间
- 简洁的工具栏，悬停显示详细功能
- 流畅的动画过渡

### 2. 高效编辑
- 基于 Tiptap 的富文本编辑器
- 支持 Markdown 语法
- 快捷键支持
- 实时自动保存
- 斜杠命令（计划中）

### 3. AI 增强
- AI 思维导图生成
- AI 文档摘要
- AI 问答助手
- 智能标签提取（计划中）

## 技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **编辑器**: Tiptap (基于 ProseMirror)
- **UI 组件**: Radix UI + Tailwind CSS
- **动画**: Framer Motion
- **图表**: ReactFlow (思维导图)
- **状态管理**: React Hooks + Context
- **存储**: IndexedDB (本地存储)

### 后端技术栈
- **API**: Next.js API Routes (Edge Runtime)
- **AI**: LangChain + OpenAI
- **数据库**: IndexedDB (客户端)

## 功能模块

### 1. 左侧边栏 (280px, 可折叠)

#### 知识库切换器
- 下拉菜单选择知识库
- 显示当前知识库名称
- 支持创建新知识库

#### 全局搜索
- 实时搜索文档标题和内容
- 支持过滤和排序

#### 文档树
- 分组显示：
  - 最近访问（最近 5 个）
  - 所有文档
  - 收藏夹（计划中）
  - 标签分组（计划中）
- 支持拖拽排序（计划中）
- 右键菜单操作

#### 底部操作栏
- 新建文档按钮
- 设置按钮

### 2. 中间编辑区 (flex-1)

#### 顶部工具栏
- 左侧：侧边栏切换按钮、文档标题
- 右侧：右侧面板切换按钮

#### 编辑器工具栏
- 撤销/重做
- 文本格式：粗体、斜体、删除线、行内代码
- 标题：H1、H2、H3
- 列表：无序列表、有序列表、任务列表
- 其他：引用、链接、图片、表格
- 保存状态指示器

#### 标题区
- 大字体可编辑标题
- 自动保存

#### 编辑器
- Tiptap 富文本编辑器
- Markdown 语法支持
- 代码高亮
- 表格编辑
- 任务列表
- 图片上传和预览

### 3. 右侧面板 (320px, 可折叠)

#### 标签页
1. **大纲**
   - 文档结构导航
   - 点击跳转到对应位置

2. **AI 功能**
   - **AI 思维导图**
     - 基于 ReactFlow 的可视化
     - 支持缩放、平移
     - 支持导出为图片
     - 可全屏查看
   - **AI 摘要**
     - 一键生成文档摘要
     - 支持复制和插入
   - **AI 问答**
     - 对话式界面
     - 基于文档内容回答问题

3. **属性**
   - 标签管理
   - 创建时间
   - 更新时间
   - 导出和分享

4. **历史**
   - 版本历史
   - 版本对比（计划中）

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + N` | 新建文档 |
| `Ctrl/Cmd + K` | 全局搜索 |
| `Ctrl/Cmd + S` | 保存文档 |
| `Ctrl/Cmd + B` | 切换左侧边栏 |
| `Ctrl/Cmd + \` | 切换右侧面板 |
| `Ctrl/Cmd + E` | 聚焦编辑器 |

### 编辑器快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + B` | 粗体 |
| `Ctrl/Cmd + I` | 斜体 |
| `Ctrl/Cmd + U` | 下划线 |
| `Ctrl/Cmd + Shift + S` | 删除线 |
| `Ctrl/Cmd + K` | 插入链接 |
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + Shift + Z` | 重做 |
| `/` | 斜杠命令（计划中） |

## 数据结构

### KBDocument
```typescript
type KBDocument = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  vaultId: string;
  version?: number;
  graphNodeId?: string;
  skillNodeIds?: string[];
  relatedDocs?: string[];
  extractedKeywords?: string[];
  lastSyncedAt?: Date;
};
```

### KBVault
```typescript
type KBVault = {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  lastAccessedAt: Date;
  isDefault: boolean;
};
```

## API 接口

### 1. 思维导图生成
- **路径**: `/api/kb/mindmap`
- **方法**: POST
- **请求体**:
  ```json
  {
    "content": "文档内容",
    "title": "文档标题"
  }
  ```
- **响应**:
  ```json
  {
    "nodes": [
      { "id": "1", "label": "中心节点", "level": 0 },
      { "id": "2", "label": "分支1", "level": 1 }
    ],
    "edges": [
      { "source": "1", "target": "2" }
    ]
  }
  ```

### 2. 文档摘要
- **路径**: `/api/kb/summary`
- **方法**: POST
- **请求体**:
  ```json
  {
    "content": "文档内容",
    "title": "文档标题"
  }
  ```
- **响应**:
  ```json
  {
    "summary": "文档摘要内容"
  }
  ```

### 3. AI 问答
- **路径**: `/api/kb/chat`
- **方法**: POST
- **请求体**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "问题" }
    ],
    "documentContent": "文档内容",
    "documentTitle": "文档标题"
  }
  ```
- **响应**:
  ```json
  {
    "response": "AI 回答"
  }
  ```

## 性能优化

### 1. 编辑器优化
- 防抖保存（500ms）
- 虚拟滚动（长文档）
- 懒加载图片

### 2. 搜索优化
- 客户端索引
- 防抖搜索
- 结果缓存

### 3. AI 功能优化
- 按需加载
- 结果缓存
- 流式响应（计划中）

## 移动端适配

### 响应式布局
- 小屏幕（< 768px）：单栏布局
- 中屏幕（768px - 1024px）：两栏布局
- 大屏幕（> 1024px）：三栏布局

### 触摸优化
- 手势支持
- 触摸友好的按钮大小
- 移动端工具栏

## 可访问性

### ARIA 支持
- 语义化 HTML
- ARIA 标签
- 键盘导航
- 屏幕阅读器支持

### 主题支持
- 亮色主题
- 暗色主题（计划中）
- 高对比度模式（计划中）

## 未来规划

### 短期（1-2 个月）
- [ ] 斜杠命令（/）
- [ ] @ 提及文档
- [ ] # 标签自动完成
- [ ] 文档模板
- [ ] 导出为 PDF
- [ ] 暗色主题

### 中期（3-6 个月）
- [ ] 实时协作
- [ ] 版本历史和对比
- [ ] 文档分享和权限管理
- [ ] 移动端 App
- [ ] 离线支持
- [ ] 云端同步

### 长期（6-12 个月）
- [ ] 插件系统
- [ ] 自定义主题
- [ ] API 开放
- [ ] 企业版功能
- [ ] 多语言支持

## 迁移指南

### 从旧版本迁移

1. **数据兼容性**
   - V2 完全兼容 V1 的数据结构
   - 自动迁移 IndexedDB 数据

2. **功能对比**
   | 功能 | V1 | V2 |
   |------|----|----|
   | 基础编辑 | ✅ | ✅ |
   | Markdown | ✅ | ✅ |
   | AI 功能 | ✅ | ✅ (增强) |
   | 思维导图 | ✅ | ✅ (优化) |
   | 快捷键 | ❌ | ✅ |
   | 动画效果 | ❌ | ✅ |
   | 响应式 | 部分 | ✅ |

3. **迁移步骤**
   - 访问 `/kb-v2` 路径
   - 系统自动检测并迁移数据
   - 测试功能是否正常
   - 反馈问题

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
http://localhost:3000/kb-v2
```

### 项目结构

```
apps/web/src/
├── app/
│   ├── kb-v2/
│   │   └── page.tsx              # 主页面
│   └── api/
│       └── kb/
│           ├── mindmap/route.ts  # 思维导图 API
│           ├── summary/route.ts  # 摘要 API
│           └── chat/route.ts     # 问答 API
├── components/
│   └── kb-v2/
│       ├── kb-layout.tsx         # 主布局
│       ├── kb-sidebar.tsx        # 左侧边栏
│       ├── kb-editor.tsx         # 编辑器
│       ├── editor-toolbar.tsx    # 编辑器工具栏
│       ├── kb-right-panel.tsx    # 右侧面板
│       ├── ai-mindmap.tsx        # AI 思维导图
│       ├── ai-summary.tsx        # AI 摘要
│       └── ai-chat.tsx           # AI 问答
└── lib/
    ├── client/
    │   └── kb-storage.ts         # 存储管理
    └── hooks/
        └── use-kb-shortcuts.ts   # 快捷键 Hook
```

### 添加新功能

1. **添加新的编辑器扩展**
   ```typescript
   // kb-editor.tsx
   import NewExtension from "@tiptap/extension-new";

   const editor = useEditor({
     extensions: [
       // ...其他扩展
       NewExtension.configure({
         // 配置
       }),
     ],
   });
   ```

2. **添加新的 AI 功能**
   - 创建 API 路由：`app/api/kb/new-feature/route.ts`
   - 创建组件：`components/kb-v2/ai-new-feature.tsx`
   - 在右侧面板中引入

3. **添加新的快捷键**
   ```typescript
   // kb-layout.tsx
   useKBShortcuts([
     {
       key: "x",
       ctrl: true,
       callback: () => {
         // 处理逻辑
       },
     },
   ]);
   ```

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 报告问题
- 使用 GitHub Issues
- 提供详细的复现步骤
- 附上截图或录屏

### 提交代码
- Fork 项目
- 创建功能分支
- 提交 Pull Request
- 等待代码审查

## 许可证

MIT License

## 联系方式

- 项目地址：https://github.com/your-repo/edunexus
- 文档地址：https://docs.edunexus.com
- 问题反馈：https://github.com/your-repo/edunexus/issues

---

**版本**: 2.0.0
**更新日期**: 2026-03-11
**作者**: EduNexus Team