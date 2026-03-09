# 游戏化成长地图系统

> 将学习路径重构为技能树式展示，采用游戏化机制提升学习动力

## 特性

- 🎮 **游戏化机制** - 经验值、技能点、成就系统
- 🌳 **技能树可视化** - 使用 React Flow 创建交互式技能树
- 🤖 **AI 智能规划** - 个性化学习路径推荐
- 📊 **进度追踪** - 实时统计和可视化进度
- 🏆 **成就系统** - 解锁徽章和特殊奖励
- 🛒 **模板市场** - 预设和社区分享的技能树
- 👥 **社交功能** - 分享、克隆、协作学习
- 📱 **响应式设计** - 支持桌面、平板和移动设备

## 快速开始

### 安装

```bash
cd apps/web
npm install reactflow @types/d3 d3
```

### 基础使用

```typescript
import SkillTreeView from '@/components/path/skill-tree';
import { frontendBasicsTree, mockProgress } from '@/lib/path/mock-data';

function MyPage() {
  return (
    <SkillTreeView
      tree={frontendBasicsTree}
      progress={mockProgress}
      onNodeClick={(nodeId) => console.log('Clicked:', nodeId)}
    />
  );
}
```

详细使用方法请查看 [快速开始指南](./SKILL_TREE_QUICKSTART.md)。

## 文档

- [完整功能文档](./SKILL_TREE_SYSTEM.md) - 详细的功能说明和技术实现
- [设计指南](./SKILL_TREE_DESIGN_GUIDE.md) - 如何设计高质量的技能树
- [快速开始](./SKILL_TREE_QUICKSTART.md) - 快速上手指南
- [API 文档](./API.md) - 后端 API 接口说明

## 核心概念

### 技能节点类型

| 类型 | 图标 | 颜色 | 经验值 | 用途 |
|------|------|------|--------|------|
| 基础技能 | ⭕ | 绿色 | 100 | 入门级技能 |
| 进阶技能 | ⬡ | 蓝色 | 150 | 中级技能 |
| 高级技能 | ⭐ | 紫色 | 200 | 专家级技能 |
| 里程碑 | ◆ | 金色 | 500 | 重要成就 |

### 节点状态

- 🔒 **未解锁** - 需完成前置技能
- ⚡ **可学习** - 可以开始学习
- ▶️ **学习中** - 正在进行中
- ✅ **已完成** - 已经完成

### 游戏化机制

#### 经验值系统
- 完成节点获得经验值
- 连击奖励：24小时内完成多个节点 +50%
- 完美完成：所有练习满分 +30%

#### 技能点系统
- 完成节点获得技能点
- 用于解锁可选技能分支
- 不同类型节点奖励不同

#### 成就系统
- 完成度成就
- 速度成就
- 精通成就
- 探索成就
- 社交成就

## 技术栈

- **React** - UI 框架
- **TypeScript** - 类型安全
- **React Flow** - 技能树可视化
- **Tailwind CSS** - 样式系统
- **Zustand** - 状态管理
- **Next.js** - 应用框架

## 项目结构

```
apps/web/src/
├── lib/path/
│   ├── skill-tree-types.ts          # 类型定义
│   ├── skill-tree-engine.ts         # 核心引擎
│   ├── unlock-system.ts             # 解锁系统
│   ├── ai-planner.ts                # AI 规划器
│   └── mock-data.ts                 # 示例数据
├── components/path/
│   ├── skill-node.tsx               # 技能节点组件
│   ├── skill-tree.tsx               # 技能树视图
│   ├── skill-detail-panel.tsx       # 详情面板
│   └── path-market.tsx              # 路径市场
└── app/path/
    └── page.tsx                     # 主页面
```

## 核心模块

### SkillTreeEngine

核心引擎，处理技能树逻辑：

```typescript
const engine = new SkillTreeEngine(tree, progress);

// 检查节点是否可解锁
engine.canUnlockNode(nodeId);

// 获取节点状态
engine.getNodeStatus(nodeId);

// 完成节点
engine.completeNode(nodeId);

// 获取推荐路径
engine.getRecommendedPath();
```

### UnlockSystem

解锁系统，管理游戏化机制：

```typescript
// 检查成就
UnlockSystem.checkAchievement(achievement, progress, tree);

// 计算技能点
UnlockSystem.calculateSkillPointReward(node);

// 检查连击奖励
UnlockSystem.checkStreakBonus(progress, date);
```

### AIPlanner

AI 规划器，智能推荐：

```typescript
// 生成个性化技能树
AIPlanner.generatePersonalizedTree(params);

// 优化学习路径
AIPlanner.optimizeLearningPath(tree, progress, constraints);

// 生成每周计划
AIPlanner.generateWeeklyPlan(tree, progress, hoursPerDay);
```

## 示例

### 前端开发基础技能树

```
        [HTML 基础]
             ↓
    ┌────────┼────────┐
    ↓        ↓        ↓
[CSS 基础] [HTML 进阶] [语义化]
    ↓        ↓        ↓
[Flexbox]  [表单]  [无障碍]
    ↓        ↓        ↓
    └────────┼────────┘
             ↓
      [响应式设计]
             ↓
    [前端基础里程碑]
```

### Python 数据科学

```
  [Python 基础]
       ↓
   [NumPy]
       ↓
  ┌────┴────┐
  ↓         ↓
[Pandas] [Matplotlib]
  ↓         ↓
  └────┬────┘
       ↓
  [探索性分析]
       ↓
  [机器学习]
```

## 自定义

### 创建自定义技能树

```typescript
const myTree: SkillTree = {
  id: 'my-tree',
  title: '我的学习路径',
  nodes: [
    {
      id: 'node-1',
      title: '第一个技能',
      type: 'basic',
      position: { x: 400, y: 50 },
      dependencies: [],
      unlocks: ['node-2'],
      // ...
    },
  ],
  edges: [
    { id: 'e1', source: 'node-1', target: 'node-2', type: 'dependency' },
  ],
  // ...
};
```

### 自定义样式

修改 `skill-node.tsx` 中的配置：

```typescript
const nodeConfig = {
  basic: {
    bgColor: 'from-green-400 to-emerald-500',
    borderColor: 'border-green-500',
    size: 'w-24 h-24',
  },
};
```

## API 集成

### 获取技能树

```typescript
GET /api/skill-trees/:id
```

### 更新进度

```typescript
POST /api/skill-trees/:id/nodes/:nodeId/complete
```

### 获取推荐

```typescript
POST /api/ai/recommend-path
```

详细 API 文档请查看 [API 文档](./API.md)。

## 性能优化

- ✅ 虚拟化渲染大型技能树
- ✅ 懒加载节点详情
- ✅ 本地缓存进度数据
- ✅ 防抖搜索和筛选
- ✅ 代码分割和按需加载

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 贡献

欢迎贡献！请查看 [贡献指南](./CONTRIBUTING.md)。

## 许可证

MIT License

## 致谢

- [React Flow](https://reactflow.dev/) - 技能树可视化
- [Tailwind CSS](https://tailwindcss.com/) - 样式系统
- [Lucide Icons](https://lucide.dev/) - 图标库

## 联系方式

- 问题反馈：[GitHub Issues](https://github.com/example/issues)
- 讨论：[GitHub Discussions](https://github.com/example/discussions)
- 邮箱：support@example.com

---

Made with ❤️ by EduNexus Team