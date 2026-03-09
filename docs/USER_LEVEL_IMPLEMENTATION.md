# 用户等级系统实现文档

## 📋 概述

EduNexus 用户等级系统是一个完整的游戏化学习激励系统，包含等级、经验值、徽章和成就等功能。

## 🏗️ 架构设计

### 数据模型

#### 1. 用户等级 (UserLevel)
```typescript
{
  userId: string;
  level: number;              // 当前等级
  currentExp: number;         // 当前等级的经验值
  totalExp: number;           // 总经验值
  title: string;              // 等级头衔
  titleEmoji: string;         // 头衔表情
  titleDescription: string;   // 头衔描述
  createdAt: string;
  updatedAt: string;
}
```

#### 2. 用户经验值 (UserExperience)
```typescript
{
  userId: string;
  learningTimeExp: number;      // 学习时长经验
  knowledgeMasteryExp: number;  // 知识掌握经验
  practiceExp: number;          // 练习完成经验
  communityExp: number;         // 社区贡献经验
  streakExp: number;            // 连续学习经验
  totalExp: number;             // 总经验值
  updatedAt: string;
}
```

#### 3. 用户统计 (UserStats)
```typescript
{
  userId: string;
  learningMinutes: number;
  notesCreated: number;
  practiceCorrect: number;
  practiceWrong: number;
  knowledgePointsMastered: number;
  currentStreak: number;
  longestStreak: number;
  // ... 更多统计字段
}
```

#### 4. 徽章 (Badge)
```typescript
{
  badgeId: string;
  name: string;
  description: string;
  emoji: string;
  category: 'learning' | 'practice' | 'community' | 'special' | 'limited';
  requirement: BadgeRequirement;
  expReward: number;
}
```

## 📁 文件结构

```
apps/web/src/
├── lib/
│   ├── server/
│   │   ├── user-level-types.ts       # 类型定义
│   │   ├── level-config.ts           # 等级配置（40个等级）
│   │   ├── badge-config.ts           # 徽章配置
│   │   ├── user-level-service.ts     # 核心业务逻辑
│   │   └── store.ts                  # 数据库扩展
│   └── hooks/
│       └── use-user-level.ts         # React Hook
├── app/
│   ├── api/
│   │   └── user/
│   │       ├── level/route.ts        # 获取等级信息
│   │       ├── experience/add/route.ts # 添加经验值
│   │       └── achievements/route.ts  # 获取成就徽章
│   └── user-level/
│       └── page.tsx                  # 等级详情页面
├── components/
│   ├── user-level-card.tsx           # 等级卡片
│   ├── exp-progress-bar.tsx          # 经验值进度条
│   ├── badge-display.tsx             # 徽章展示
│   ├── user-stats-display.tsx        # 统计数据展示
│   ├── compact-level-display.tsx     # 紧凑等级显示
│   └── level-animations.tsx          # 升级动画
└── scripts/
    └── test-user-level.mjs           # 测试脚本
```

## 🎮 经验值获取规则

### 日常学习
- 学习 1 分钟 = 2 EXP
- 创建 1 篇笔记 = 20 EXP
- 编辑 1 篇笔记 = 5 EXP
- 完成 1 道练习题（正确）= 10 EXP
- 完成 1 道练习题（错误）= 2 EXP

### 知识掌握
- 掌握 1 个知识点 = 50 EXP
- 完成 1 条学习路径 = 200 EXP
- 通过 1 次测验 = 100 EXP

### 社区贡献
- 发布 1 篇动态 = 5 EXP
- 回答 1 个问题 = 10 EXP
- 答案被采纳 = 30 EXP
- 获得 1 个赞 = 1 EXP
- 分享 1 篇笔记 = 15 EXP

### 连续学习
- 连续学习 1 天 = 20 EXP
- 连续学习 7 天 = 额外 100 EXP
- 连续学习 30 天 = 额外 500 EXP
- 连续学习 100 天 = 额外 2000 EXP

## 🌟 等级系统

### 等级阶段

1. **初学者阶段 (Lv 1-10)**
   - Lv 1: 懵懂萌新 🐣 (0-100 EXP)
   - Lv 5: 好学少年 🎒 (1001-1500 EXP)
   - Lv 10: 知识收割机 🌾 (5001-6500 EXP)

2. **进阶者阶段 (Lv 11-20)**
   - Lv 11: 学霸预备役 📖 (6501-8000 EXP)
   - Lv 15: 社区活跃分子 💬 (14501-17500 EXP)
   - Lv 20: 学霸本霸 👑 (36001-43000 EXP)

3. **大师阶段 (Lv 21-30)**
   - Lv 21: 知识炼金术士 ⚗️ (43001-51000 EXP)
   - Lv 25: 终身学习践行者 🌟 (82001-96000 EXP)
   - Lv 30: 知识宇宙探索者 🌌 (175001-200000 EXP)

4. **传说阶段 (Lv 31-40)**
   - Lv 40: 学习之神 👼 (700001+ EXP)

## 🏅 徽章系统

### 徽章类别

1. **学习徽章**
   - 🥉 青铜学者 (学习 10 小时)
   - 🥈 白银学者 (学习 50 小时)
   - 🥇 黄金学者 (学习 100 小时)
   - 💎 钻石学者 (学习 500 小时)
   - 👑 王者学者 (学习 1000 小时)

2. **练习徽章**
   - 🎯 新手射手 (完成 10 道题)
   - 🏹 神射手 (完成 100 道题)
   - 🎪 百发百中 (完成 1000 道题)

3. **社区徽章**
   - 💬 话痨 (发帖 100 次)
   - 🎤 演说家 (回答 50 个问题)
   - 🏆 最佳答主 (被采纳 20 次)

4. **特殊徽章**
   - 🌈 全能战士 (各项指标均衡发展)
   - 🔥 学习狂魔 (单月学习 100 小时)
   - 🎨 创作大师 (创作 100 篇优质笔记)

## 🔌 API 接口

### 1. 获取用户等级信息
```
GET /api/user/level?userId=demo_user
```

响应：
```json
{
  "success": true,
  "data": {
    "level": { ... },
    "experience": { ... },
    "stats": { ... },
    "nextLevel": { ... }
  }
}
```

### 2. 添加经验值
```
POST /api/user/experience/add
Content-Type: application/json

{
  "userId": "demo_user",
  "eventType": "learning_minute",
  "metadata": {}
}
```

响应：
```json
{
  "success": true,
  "data": {
    "expGained": 2,
    "levelUp": false,
    "newLevel": null,
    "unlockedBadges": []
  }
}
```

### 3. 获取成就和徽章
```
GET /api/user/achievements?userId=demo_user&category=learning
```

响应：
```json
{
  "success": true,
  "data": {
    "achievements": [...],
    "badges": [...],
    "stats": {
      "total": 30,
      "unlocked": 5,
      "progress": 16.67
    }
  }
}
```

## 🎨 前端组件使用

### 1. 用户等级卡片
```tsx
import { UserLevelCard } from '@/components/user-level-card';

<UserLevelCard
  level={5}
  title="好学少年"
  titleEmoji="🎒"
  titleDescription="求知欲旺盛，总是问个不停"
  currentExp={200}
  totalExp={1200}
  nextLevel={{
    level: 6,
    title: "刷题狂魔",
    titleEmoji: "💪",
    expNeeded: 300,
    progressPercent: 40
  }}
/>
```

### 2. 紧凑等级显示（用于工作区）
```tsx
import { CompactLevelDisplay } from '@/components/compact-level-display';

<CompactLevelDisplay userId="demo_user" showProgress={true} />
```

### 3. 徽章展示
```tsx
import { BadgeDisplay } from '@/components/badge-display';

<BadgeDisplay badges={badgesData} />
```

### 4. 使用 Hook 添加经验值
```tsx
import { useUserLevel } from '@/lib/hooks/use-user-level';

function MyComponent() {
  const { addExp, loading } = useUserLevel('demo_user');

  const handleLearning = async () => {
    const result = await addExp('learning_minute');
    if (result.levelUp) {
      // 显示升级动画
    }
  };
}
```

## 🧪 测试

运行测试脚本：
```bash
# 启动开发服务器
pnpm dev

# 在另一个终端运行测试
node apps/web/scripts/test-user-level.mjs
```

## 🔄 集成到现有系统

### 1. 在学习工作区显示等级
已集成到 `apps/web/src/app/workspace/page.tsx`，在右侧状态面板顶部显示。

### 2. 学习行为触发经验值
在以下场景自动添加经验值：
- 用户学习时长统计
- 创建/编辑笔记
- 完成练习题
- 掌握知识点
- 社区互动

示例代码：
```typescript
// 在笔记保存后
await fetch('/api/user/experience/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUserId,
    eventType: 'create_note'
  })
});
```

### 3. 显示升级动画
```tsx
import { LevelUpAnimation, ExpGainAnimation } from '@/components/level-animations';

// 升级时
{showLevelUp && (
  <LevelUpAnimation
    level={newLevel}
    title={newTitle}
    titleEmoji={newEmoji}
    onComplete={() => setShowLevelUp(false)}
  />
)}

// 获得经验值时
{showExpGain && (
  <ExpGainAnimation
    exp={expGained}
    message="完成练习题"
    onComplete={() => setShowExpGain(false)}
  />
)}
```

## 📊 数据存储

用户等级数据存储在 `.edunexus/data/db.json` 文件中：

```json
{
  "userLevels": {
    "demo_user": { ... }
  },
  "userExperience": {
    "demo_user": { ... }
  },
  "userStats": {
    "demo_user": { ... }
  },
  "userAchievements": [ ... ],
  "expGainHistory": [ ... ]
}
```

## 🚀 未来扩展

1. **排行榜系统**
   - 等级排行榜
   - 经验值排行榜
   - 徽章收集排行榜

2. **社交功能**
   - 查看好友等级
   - 等级对比
   - 成就分享

3. **限时活动**
   - 节日特殊徽章
   - 限时经验加成
   - 活动挑战

4. **个性化**
   - 自定义头衔
   - 等级皮肤
   - 徽章展示位

## 📝 注意事项

1. 经验值计算是累加的，不会减少
2. 等级只能升不能降
3. 徽章解锁后永久保留
4. 连续学习天数需要每天至少学习一次
5. 所有时间戳使用 ISO 8601 格式

## 🤝 贡献

如需添加新的等级、徽章或经验值规则，请修改：
- `apps/web/src/lib/server/level-config.ts` - 等级配置
- `apps/web/src/lib/server/badge-config.ts` - 徽章配置
- `apps/web/src/lib/server/user-level-service.ts` - 经验值规则

---

**设计者**: EduNexus 开发团队
**实现日期**: 2026-03-09
**版本**: v1.0
