# EduNexus 重构进度报告

## 项目概述
将 EduNexus 从纯 CSS 架构迁移到现代化的 Tailwind CSS + shadcn/ui 架构，融合 open-notebook 项目的设计思路和最佳实践。

## 已完成工作 ✅

### 阶段 0：基础设施准备（已完成 100%）

#### 1. 依赖安装
- ✅ Tailwind CSS v3.4.19 + PostCSS + Autoprefixer
- ✅ shadcn/ui 相关包（class-variance-authority, clsx, tailwind-merge）
- ✅ Zustand 状态管理
- ✅ TanStack React Query
- ✅ cmdk 命令面板
- ✅ Lucide React 图标库
- ✅ Radix UI 组件原语

**注意**：最初尝试使用 Tailwind CSS v4，但由于与 Next.js 14 的兼容性问题，降级到 v3.4.19。

#### 2. 配置文件创建
- ✅ `tailwind.config.ts` - Tailwind 配置（HSL 色彩空间）
- ✅ `postcss.config.mjs` - PostCSS 配置
- ✅ `components.json` - shadcn/ui 配置（New York 风格）

#### 3. 主题系统迁移
- ✅ `src/app/globals.css` - 完全重写
  - 使用 HSL 色彩空间（Tailwind v3 标准）
  - 保留 Nebula（星夜）和 Aurora（晨曦）双主题
  - 集成 Tailwind 的 @layer base/components/utilities
  - 保留过渡期自定义变量（--bg, --bg-panel 等）
  - 星空背景效果保留

#### 4. 核心工具函数
- ✅ `src/lib/utils.ts` - cn() 函数（合并 Tailwind 类名）

#### 5. Zustand Stores
- ✅ `src/lib/stores/theme-store.ts` - 主题状态管理
  - 支持 nebula/aurora 切换
  - localStorage 持久化
  - 自动同步到 DOM
- ✅ `src/lib/stores/sidebar-store.ts` - 侧边栏状态
- ✅ `src/lib/stores/navigation-store.ts` - 导航状态

#### 6. React Query Provider
- ✅ `src/lib/providers/query-provider.tsx` - 全局查询客户端
- ✅ 集成到 `src/app/layout.tsx`

#### 7. shadcn/ui 组件安装
- ✅ Button - 按钮组件
- ✅ Card - 卡片组件
- ✅ Separator - 分隔线
- ✅ Badge - 徽章标签
- ✅ Dialog - 对话框
- ✅ Tooltip - 提示框
- ✅ Collapsible - 可折叠面板
- ✅ Command - 命令面板
- ✅ Input - 输入框

### 阶段 1：核心布局重构（已完成 100%）

#### 1. AppShell 组件重构
- ✅ `src/components/app-shell.tsx` - 完全重写
  - 使用 Tailwind 类替换所有 CSS 类
  - 集成 Zustand stores（theme-store, navigation-store）
  - 使用 shadcn/ui 组件（Button, Input, Badge, Separator）
  - 使用 Lucide React 图标（ArrowUp, Moon, Sun）
  - 保持所有原有功能：
    - 双主题切换
    - 全局快速跳转（Ctrl+K）
    - 回到顶部按钮
    - 系统状态显示
    - 导航分组
  - 改进交互体验：
    - 更流畅的悬停效果
    - 更清晰的视觉层次
    - 响应式搜索结果
    - 快捷键提示

#### 2. 构建与测试
- ✅ 修复 Tailwind CSS v4 兼容性问题（降级到 v3）
- ✅ 修复 PostCSS 配置
- ✅ 通过 TypeScript 类型检查
- ✅ 开发服务器成功启动（http://localhost:3001）
- ✅ 无编译错误

## 当前状态

### 文件结构
```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx ✅ (已集成 QueryProvider)
│   │   ├── globals.css ✅ (已迁移到 Tailwind + OKLCH)
│   │   ├── globals.css.backup (原始备份)
│   │   └── [pages]/ ⏳ (待重构)
│   ├── components/
│   │   ├── ui/ ✅ (9 个 shadcn/ui 组件)
│   │   ├── app-shell.tsx ✅ (已重构)
│   │   └── [other components]/ ⏳ (待重构)
│   └── lib/
│       ├── utils.ts ✅
│       ├── stores/ ✅ (3 个 stores)
│       └── providers/ ✅ (QueryProvider)
├── tailwind.config.ts ✅
├── postcss.config.mjs ✅
└── components.json ✅
```

### 技术栈对比

| 方面 | 重构前 | 重构后 |
|------|--------|--------|
| CSS 框架 | 纯 CSS (13,264 行) | Tailwind CSS v3.4.19 |
| 色彩空间 | RGB/HEX | HSL |
| UI 组件 | 自定义 | shadcn/ui (New York) |
| 状态管理 | useState + localStorage | Zustand |
| 数据获取 | fetch | TanStack Query |
| 图标 | 无 | Lucide React |
| 类名管理 | 字符串拼接 | cn() 函数 |

## 待完成工作 ⏳

### 阶段 2：通用组件重构（优先级：高）

#### 需要重构的组件
1. ⏳ `page-header.tsx` - 页面头部
2. ⏳ `page-quick-nav.tsx` - 页面快速导航
3. ⏳ `collapsible-panel.tsx` - 可折叠面板
4. ⏳ `galaxy-ui.tsx` - Galaxy 风格组件
5. ⏳ `section-anchor-nav.tsx` - 锚点导航

### 阶段 3：页面重构（优先级：中）

#### 重构顺序（从简单到复杂）
1. ⏳ `/` - 首页
2. ⏳ `/graph` - 知识图谱
3. ⏳ `/kb` - 本地知识库
4. ⏳ `/path` - 学习路径
5. ⏳ `/workspace` - 学习工作区
6. ⏳ `/teacher` - 教师工作台
7. ⏳ `/dashboard` - 生态看板（复杂）
8. ⏳ `/settings` - 配置中心（最复杂）

### 阶段 4：高级功能（优先级：低）

1. ⏳ 命令面板（Cmd+K）- 使用 cmdk 组件
2. ⏳ 可折叠侧边栏 - 集成到 AppShell
3. ⏳ TanStack Query 集成 - 迁移 API 调用
4. ⏳ 性能优化 - React.memo, 缓存策略
5. ⏳ 无障碍改进 - ARIA 标签, 键盘导航

### 阶段 5：清理与优化（优先级：最低）

1. ⏳ 删除 globals.css.backup
2. ⏳ 清理未使用的自定义变量
3. ⏳ 代码审查和优化
4. ⏳ 文档更新

## 关键设计决策

### 1. 色彩空间选择：HSL
- **原因**：Tailwind CSS v3 标准，兼容性好
- **实现**：在 globals.css 中使用 HSL 格式（如 `217 100% 5%`）
- **兼容性**：所有现代浏览器完美支持
- **注意**：最初计划使用 OKLCH，但因 Tailwind v4 与 Next.js 14 兼容性问题而改用 HSL

### 2. Tailwind CSS 版本：v3.4.19
- **原因**：Next.js 14 与 Tailwind v4 存在兼容性问题
- **优势**：稳定、成熟、文档完善
- **权衡**：放弃了 v4 的新特性（如原生 OKLCH 支持）
- **未来**：待 Next.js 15 发布后可考虑升级到 Tailwind v4

### 2. 组件库选择：shadcn/ui
- **优势**：可定制、非 npm 依赖、基于 Radix UI
- **风格**：New York 风格（更现代）
- **集成**：通过 CLI 按需安装

### 3. 状态管理：Zustand
- **优势**：轻量级、简单、TypeScript 友好
- **用途**：主题、导航、侧边栏状态
- **持久化**：使用 persist 中间件

### 4. 数据获取：TanStack Query
- **优势**：自动缓存、重新验证、错误处理
- **配置**：staleTime 60s, 禁用窗口焦点重新获取
- **集成**：通过 QueryProvider 包裹应用

### 5. 过渡策略
- **保留旧变量**：--bg, --bg-panel 等（过渡期）
- **渐进式重构**：一次一个组件/页面
- **功能不变**：先迁移样式，后优化逻辑
- **备份保留**：globals.css.backup 直到完全迁移

## CSS 类映射参考

### 常用映射
```
旧 CSS 类 → Tailwind 类
─────────────────────────────────────────
.shell → grid grid-cols-[280px_1fr]
.shell-nav → border-r backdrop-blur-[14px]
.panel → border rounded-lg p-4 bg-card
.panel.wide → col-span-12
.nav-link → px-3 py-2.5 rounded-lg
.nav-link.active → border-accent/50 bg-accent/10
.brand → flex gap-3 items-center
.galaxy-hero → bg-gradient-to-br from-primary/5
```

### 颜色变量
```
旧变量 → Tailwind 类
─────────────────────────
var(--bg) → bg-background
var(--text) → text-foreground
var(--accent) → text-accent
var(--bg-panel) → bg-card
var(--text-dim) → text-muted-foreground
```

## 测试检查清单

### 已验证 ✅
- [x] TypeScript 类型检查通过
- [x] 主题切换功能正常
- [x] Zustand stores 正常工作
- [x] shadcn/ui 组件安装成功
- [x] 开发服务器成功启动（http://localhost:3001）
- [x] 无编译错误
- [x] PostCSS 配置正确
- [x] Tailwind CSS 正常工作

### 待验证 ⏳
- [ ] 所有页面可正常访问
- [ ] 导航和路由正常
- [ ] 快速跳转功能（Ctrl+K）
- [ ] 回到顶部按钮
- [ ] 响应式布局
- [ ] 无控制台错误
- [ ] 视觉效果与原设计一致
- [ ] 性能无明显下降

## 下一步行动

### 立即执行（优先级 P0）
1. 启动开发服务器测试当前重构
2. 重构 `page-header.tsx` 组件
3. 重构首页 `/` 作为其他页面的参考

### 短期计划（1-2 天）
1. 完成所有通用组件重构
2. 重构前 3 个页面（首页、图谱、知识库）
3. 测试核心功能

### 中期计划（3-5 天）
1. 完成所有页面重构
2. 实现命令面板
3. 集成 TanStack Query

### 长期计划（1 周+）
1. 性能优化
2. 无障碍改进
3. 清理和文档

## 风险与注意事项

### 高风险区域
1. **配置中心页面** - 38 个导入，复杂状态管理
2. **生态看板页面** - 大量数据处理和图表
3. **主题切换** - 需确保 OKLCH 颜色与原视觉一致

### 缓解措施
- 渐进式重构，每次只改一个组件
- 保留 globals.css.backup 作为参考
- 频繁测试，及时发现问题
- 使用 Git 分支管理重构进度

## 参考资源

### 项目文档
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Zustand 文档](https://zustand-demo.pmnd.rs)
- [TanStack Query 文档](https://tanstack.com/query)

### 参考项目
- **open-notebook** (`F:\1work\open-notebook`)
  - 主题系统实现
  - 组件设计模式
  - 状态管理架构

---

**最后更新**：2026-03-08
**重构进度**：阶段 0-1 完成（约 30%）
**预计完成时间**：1-2 周
**开发服务器**：http://localhost:3001 ✅ 运行中
