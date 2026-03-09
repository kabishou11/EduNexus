# 游戏化成长地图 - 快速开始

## 安装依赖

```bash
cd apps/web
npm install reactflow @types/d3 d3
```

## 文件结构

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

## 快速使用

### 1. 导入组件和类型

```typescript
import SkillTreeView from '@/components/path/skill-tree';
import SkillDetailPanel from '@/components/path/skill-detail-panel';
import PathMarket from '@/components/path/path-market';
import { SkillTreeEngine } from '@/lib/path/skill-tree-engine';
import { frontendBasicsTree, mockProgress } from '@/lib/path/mock-data';
import type { SkillTree, SkillTreeProgress } from '@/lib/path/skill-tree-types';
```

### 2. 初始化技能树引擎

```typescript
const [currentTree, setCurrentTree] = useState<SkillTree>(frontendBasicsTree);
const [progress, setProgress] = useState<SkillTreeProgress>(mockProgress);

const engine = useMemo(
  () => new SkillTreeEngine(currentTree, progress),
  [currentTree, progress]
);
```

### 3. 渲染技能树

```typescript
<SkillTreeView
  tree={currentTree}
  progress={progress}
  onNodeClick={handleNodeClick}
  onNodeComplete={handleCompleteNode}
/>
```

### 4. 处理节点交互

```typescript
// 点击节点
const handleNodeClick = useCallback((nodeId: string) => {
  const node = currentTree.nodes.find((n) => n.id === nodeId);
  if (node) {
    setSelectedNode(node);
    setShowDetailPanel(true);
  }
}, [currentTree]);

// 开始学习
const handleStartNode = useCallback(() => {
  if (!selectedNode) return;
  const success = engine.unlockNode(selectedNode.id);
  if (success) {
    setProgress({ ...progress });
  }
}, [selectedNode, engine, progress]);

// 完成节点
const handleCompleteNode = useCallback(() => {
  if (!selectedNode) return;
  const result = engine.completeNode(selectedNode.id);
  if (result.success) {
    setProgress({ ...progress });
    alert(`获得 ${result.expGained} 经验值！`);
  }
}, [selectedNode, engine, progress]);
```

### 5. 显示详情面板

```typescript
{showDetailPanel && selectedNode && (
  <SkillDetailPanel
    node={selectedNode}
    status={engine.getNodeStatus(selectedNode.id)}
    onClose={() => setShowDetailPanel(false)}
    onStart={handleStartNode}
    onComplete={handleCompleteNode}
    onUnlock={handleUnlockNode}
  />
)}
```

## 核心 API

### SkillTreeEngine

```typescript
// 创建引擎实例
const engine = new SkillTreeEngine(tree, progress);

// 检查节点是否可解锁
const canUnlock = engine.canUnlockNode(nodeId);

// 获取节点状态
const status = engine.getNodeStatus(nodeId);

// 解锁节点
const success = engine.unlockNode(nodeId);

// 完成节点
const result = engine.completeNode(nodeId);

// 获取可用节点
const availableNodes = engine.getAvailableNodes();

// 获取推荐路径
const recommendedPath = engine.getRecommendedPath();

// 获取统计信息
const stats = engine.getStats();
```

### AI 推荐

```typescript
import { generateAIRecommendations } from '@/lib/path/skill-tree-engine';

const recommendations = generateAIRecommendations(tree, progress, {
  focusAreas: ['React', 'TypeScript'],
  availableHoursPerWeek: 10,
  learningStyle: 'practical',
});
```

### 解锁系统

```typescript
import { UnlockSystem } from '@/lib/path/unlock-system';

// 检查成就
const isUnlocked = UnlockSystem.checkAchievement(achievement, progress, tree);

// 获取成就进度
const achievementProgress = UnlockSystem.getAchievementProgress(
  achievement,
  progress,
  tree
);

// 计算技能点奖励
const skillPoints = UnlockSystem.calculateSkillPointReward(node);

// 检查连击奖励
const streakBonus = UnlockSystem.checkStreakBonus(progress, new Date());
```

### AI 规划器

```typescript
import { AIPlanner } from '@/lib/path/ai-planner';

// 生成个性化技能树
const personalizedTree = AIPlanner.generatePersonalizedTree({
  topic: 'React 开发',
  userLevel: 'beginner',
  goals: ['找工作', '做项目'],
  availableHoursPerWeek: 10,
  learningStyle: 'practical',
});

// 优化学习路径
const optimizedPath = AIPlanner.optimizeLearningPath(tree, progress, {
  targetCompletionDate: new Date('2026-06-01'),
  dailyHours: 2,
  priorityNodes: ['react-hooks', 'typescript'],
});

// 生成每周计划
const weeklyPlan = AIPlanner.generateWeeklyPlan(tree, progress, 2);
```

## 自定义技能树

### 创建新技能树

```typescript
const mySkillTree: SkillTree = {
  id: 'my-tree',
  title: '我的学习路径',
  description: '自定义学习路径',
  category: 'custom',
  difficulty: 'beginner',
  nodes: [
    {
      id: 'node-1',
      title: '第一个技能',
      description: '学习基础知识',
      type: 'basic',
      status: 'available',
      position: { x: 400, y: 50 },
      dependencies: [],
      unlocks: ['node-2'],
      resources: [],
      exercises: [],
      projects: [],
      progress: 0,
      exp: 100,
      skillPoints: 0,
      estimatedHours: 8,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 更多节点...
  ],
  edges: [
    { id: 'e1', source: 'node-1', target: 'node-2', type: 'dependency' },
    // 更多边...
  ],
  totalNodes: 1,
  completedNodes: 0,
  totalExp: 100,
  earnedExp: 0,
  availableSkillPoints: 0,
  totalSkillPoints: 0,
  author: 'Me',
  tags: ['自定义'],
  rating: 0,
  enrollments: 0,
  isPublic: false,
  isTemplate: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### 添加学习资源

```typescript
const resource: SkillResource = {
  id: 'r1',
  title: 'MDN 文档',
  type: 'documentation',
  url: 'https://developer.mozilla.org',
  difficulty: 'beginner',
  completed: false,
  duration: '2 小时',
};

node.resources.push(resource);
```

### 添加练习题

```typescript
const exercise: SkillExercise = {
  id: 'e1',
  title: '基础练习',
  description: '完成基础练习题',
  difficulty: 'easy',
  points: 10,
  completed: false,
  attempts: 0,
};

node.exercises.push(exercise);
```

## 样式自定义

### 修改节点颜色

编辑 `skill-node.tsx`：

```typescript
const nodeConfig = {
  basic: {
    Icon: Circle,
    bgColor: 'from-green-400 to-emerald-500',  // 修改这里
    borderColor: 'border-green-500',
    shadowColor: 'shadow-green-500/50',
    size: 'w-24 h-24',
  },
  // ...
};
```

### 修改布局

编辑 `skill-tree.tsx`：

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  fitViewOptions={{
    padding: 0.2,      // 调整内边距
    minZoom: 0.5,      // 最小缩放
    maxZoom: 1.5,      // 最大缩放
  }}
  defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}  // 默认视图
>
```

## 集成后端 API

### 获取技能树

```typescript
async function fetchSkillTree(treeId: string): Promise<SkillTree> {
  const response = await fetch(`/api/skill-trees/${treeId}`);
  return response.json();
}
```

### 更新进度

```typescript
async function updateProgress(
  treeId: string,
  nodeId: string,
  action: 'start' | 'complete'
): Promise<void> {
  await fetch(`/api/skill-trees/${treeId}/nodes/${nodeId}/${action}`, {
    method: 'POST',
  });
}
```

### 保存笔记

```typescript
async function saveNotes(
  treeId: string,
  nodeId: string,
  notes: string
): Promise<void> {
  await fetch(`/api/skill-trees/${treeId}/nodes/${nodeId}/notes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
}
```

## 常见问题

### Q: 如何添加新的节点类型？

A: 在 `skill-tree-types.ts` 中添加新类型，然后在 `skill-node.tsx` 中添加对应的配置。

### Q: 如何自定义动画效果？

A: 编辑 `unlock-system.ts` 中的 `getUnlockAnimation` 函数。

### Q: 如何导出技能树？

A: 使用 `JSON.stringify(tree)` 导出为 JSON 格式。

### Q: 如何实现多语言支持？

A: 使用 i18n 库，将所有文本提取到语言文件中。

## 下一步

- 查看 [完整功能文档](./SKILL_TREE_SYSTEM.md)
- 阅读 [设计指南](./SKILL_TREE_DESIGN_GUIDE.md)
- 浏览示例代码
- 创建自己的技能树

## 支持

如有问题，请：
- 查看文档
- 提交 Issue
- 加入社区讨论