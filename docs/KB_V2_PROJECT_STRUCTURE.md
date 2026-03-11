# 知识库 V2 项目结构

## 📁 目录结构

```
EduNexus/
├── apps/web/src/
│   ├── app/
│   │   ├── kb-v2/
│   │   │   └── page.tsx                    # 主页面
│   │   ├── api/kb/
│   │   │   ├── mindmap/route.ts            # 思维导图 API
│   │   │   ├── summary/route.ts            # 摘要 API
│   │   │   └── chat/route.ts               # 问答 API
│   │   └── globals.css                     # 全局样式（含 Tiptap 样式）
│   │
│   ├── components/kb-v2/
│   │   ├── kb-layout.tsx                   # 主布局
│   │   ├── kb-sidebar.tsx                  # 左侧边栏
│   │   ├── kb-editor.tsx                   # 编辑器
│   │   ├── editor-toolbar.tsx              # 编辑器工具栏
│   │   ├── kb-right-panel.tsx              # 右侧面板
│   │   ├── ai-mindmap.tsx                  # AI 思维导图
│   │   ├── ai-summary.tsx                  # AI 摘要
│   │   └── ai-chat.tsx                     # AI 问答
│   │
│   └── lib/
│       ├── client/
│       │   └── kb-storage.ts               # 存储管理（已存在）
│       └── hooks/
│           └── use-kb-shortcuts.ts         # 快捷键 Hook
│
├── docs/
│   ├── KB_V2_DESIGN.md                     # 设计文档
│   ├── KB_V2_USER_GUIDE.md                 # 使用指南
│   ├── KB_V2_README.md                     # 项目说明
│   ├── KB_V1_VS_V2.md                      # 功能对比
│   ├── KB_V2_CHANGELOG.md                  # 更新日志
│   ├── KB_V2_IMPLEMENTATION_SUMMARY.md     # 实现总结
│   └── KB_V2_QUICK_REFERENCE.md            # 快速参考
│
├── start-kb-v2.sh                          # Linux/Mac 启动脚本
└── start-kb-v2.bat                         # Windows 启动脚本
```

## 📄 文件说明

### 核心组件

#### 1. kb-layout.tsx
**职责**: 主布局组件
- 管理三栏布局
- 控制侧边栏折叠状态
- 处理快捷键
- 协调各子组件

**关键功能**:
- 左侧边栏折叠/展开
- 右侧面板折叠/展开
- 快捷键监听
- 动画过渡

#### 2. kb-sidebar.tsx
**职责**: 左侧边栏
- 知识库切换
- 全局搜索
- 文档树展示
- 新建文档

**关键功能**:
- 知识库下拉菜单
- 实时搜索过滤
- 文档分组（最近访问、所有文档）
- 右键菜单
- 新建文档对话框

#### 3. kb-editor.tsx
**职责**: 编辑器组件
- Tiptap 编辑器初始化
- 文档内容编辑
- 自动保存

**关键功能**:
- 富文本编辑
- Markdown 支持
- 防抖保存
- 标题编辑
- 保存状态显示

#### 4. editor-toolbar.tsx
**职责**: 编辑器工具栏
- 格式化按钮
- 保存状态显示

**关键功能**:
- 撤销/重做
- 文本格式（粗体、斜体、删除线、代码）
- 标题（H1-H3）
- 列表（无序、有序、任务）
- 其他（引用、链接、图片、表格）
- 保存时间显示

#### 5. kb-right-panel.tsx
**职责**: 右侧面板
- 标签页管理
- 功能集成

**关键功能**:
- 大纲（计划中）
- AI 功能集成
- 文档属性
- 版本历史（计划中）

#### 6. ai-mindmap.tsx
**职责**: AI 思维导图
- 思维导图生成
- 可视化展示

**关键功能**:
- ReactFlow 图表
- 缩放和平移
- 全屏查看
- 导出（计划中）

#### 7. ai-summary.tsx
**职责**: AI 摘要
- 摘要生成
- 摘要管理

**关键功能**:
- 一键生成
- 复制摘要
- 重新生成

#### 8. ai-chat.tsx
**职责**: AI 问答
- 对话管理
- 消息展示

**关键功能**:
- 发送消息
- 显示对话历史
- 多轮对话

### API 路由

#### 1. mindmap/route.ts
**端点**: POST /api/kb/mindmap
**功能**: 生成思维导图
**输入**:
```json
{
  "content": "文档内容",
  "title": "文档标题"
}
```
**输出**:
```json
{
  "nodes": [...],
  "edges": [...]
}
```

#### 2. summary/route.ts
**端点**: POST /api/kb/summary
**功能**: 生成文档摘要
**输入**:
```json
{
  "content": "文档内容",
  "title": "文档标题"
}
```
**输出**:
```json
{
  "summary": "摘要内容"
}
```

#### 3. chat/route.ts
**端点**: POST /api/kb/chat
**功能**: AI 问答
**输入**:
```json
{
  "messages": [...],
  "documentContent": "文档内容",
  "documentTitle": "文档标题"
}
```
**输出**:
```json
{
  "response": "AI 回答"
}
```

### 工具和 Hooks

#### use-kb-shortcuts.ts
**功能**: 快捷键管理
- 监听键盘事件
- 执行快捷键回调
- 预定义快捷键常量

### 文档

#### KB_V2_DESIGN.md
- 设计理念
- 技术架构
- 功能模块
- API 文档
- 开发指南

#### KB_V2_USER_GUIDE.md
- 快速开始
- 功能介绍
- 使用技巧
- 常见问题
- 最佳实践

#### KB_V2_README.md
- 项目概述
- 主要特性
- 快速开始
- 技术栈

#### KB_V1_VS_V2.md
- 详细功能对比
- 迁移建议
- 未来规划

#### KB_V2_CHANGELOG.md
- 版本更新
- 新增功能
- 已知问题
- 计划功能

#### KB_V2_IMPLEMENTATION_SUMMARY.md
- 实现总结
- 文件清单
- 测试清单
- 下一步操作

#### KB_V2_QUICK_REFERENCE.md
- 快速参考
- 快捷键
- 常用功能

## 🔗 组件关系

```
page.tsx (主页面)
    │
    └── KBLayout (主布局)
            │
            ├── KBSidebar (左侧边栏)
            │       ├── 知识库切换器
            │       ├── 搜索框
            │       ├── 文档树
            │       └── 新建按钮
            │
            ├── KBEditor (编辑器)
            │       ├── EditorToolbar (工具栏)
            │       ├── 标题编辑
            │       └── Tiptap 编辑器
            │
            └── KBRightPanel (右侧面板)
                    ├── 大纲标签页
                    ├── AI 标签页
                    │   ├── AIMindMap
                    │   ├── AISummary
                    │   └── AIChat
                    ├── 属性标签页
                    └── 历史标签页
```

## 🔄 数据流

```
用户操作
    │
    ├── 编辑文档
    │   └── KBEditor → 防抖保存 → kb-storage → IndexedDB
    │
    ├── 搜索文档
    │   └── KBSidebar → 过滤文档列表 → 显示结果
    │
    ├── AI 功能
    │   ├── 思维导图: AIMindMap → /api/kb/mindmap → OpenAI → ReactFlow
    │   ├── 摘要: AISummary → /api/kb/summary → OpenAI → 显示
    │   └── 问答: AIChat → /api/kb/chat → OpenAI → 对话历史
    │
    └── 快捷键
        └── useKBShortcuts → 监听键盘 → 执行回调
```

## 📦 依赖关系

### 核心依赖
- **Next.js 14**: 应用框架
- **React 18**: UI 库
- **TypeScript**: 类型系统

### 编辑器
- **@tiptap/react**: 编辑器核心
- **@tiptap/starter-kit**: 基础扩展
- **@tiptap/extension-***: 各种扩展

### UI 组件
- **Radix UI**: 无障碍组件
- **Tailwind CSS**: 样式框架
- **Framer Motion**: 动画库

### 图表
- **ReactFlow**: 思维导图

### AI
- **LangChain**: AI 框架
- **OpenAI**: AI 模型

### 存储
- **IndexedDB**: 本地存储

## 🎯 关键路径

### 1. 创建文档
```
用户点击"新建文档"
→ KBSidebar 显示对话框
→ 输入标题
→ 调用 onCreateDocument
→ kb-storage.createDocument
→ 更新文档列表
→ 选中新文档
```

### 2. 编辑文档
```
用户输入内容
→ Tiptap onUpdate
→ 防抖 500ms
→ 调用 onUpdateDocument
→ kb-storage.updateDocument
→ 更新 IndexedDB
→ 显示保存状态
```

### 3. 生成思维导图
```
用户点击"生成思维导图"
→ AIMindMap.generateMindMap
→ POST /api/kb/mindmap
→ LangChain + OpenAI
→ 返回节点和边
→ ReactFlow 渲染
```

## 🔍 调试指南

### 查看组件状态
```javascript
// 在浏览器控制台
console.log(document.querySelector('[data-component="kb-layout"]'));
```

### 查看 IndexedDB
1. 打开浏览器开发者工具
2. 切换到 Application/Storage 标签
3. 展开 IndexedDB
4. 查看 EduNexusKB 数据库

### 查看 API 请求
1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 筛选 XHR/Fetch
4. 查看 /api/kb/* 请求

## 📊 性能监控

### 关键指标
- **首屏加载**: < 2s
- **编辑器响应**: < 100ms
- **搜索响应**: < 200ms
- **AI 响应**: < 5s

### 优化建议
1. 使用 React.memo 优化组件
2. 使用 useMemo/useCallback 优化计算
3. 懒加载 AI 组件
4. 虚拟滚动长列表

---

**版本**: 2.0.0
**更新**: 2026-03-11