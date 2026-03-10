# 用户个人主页系统

完整的用户个人主页系统，展示用户的学习成就和社交信息。

## 功能特性

### 1. 个人资料
- ✅ 基本信息（头像、昵称、签名、学校/公司）
- ✅ 学习标签（兴趣方向、技能标签）
- ✅ 社交链接（GitHub、博客、Twitter）
- ✅ 个人简介（Markdown 支持）
- ✅ 背景图片/封面
- ✅ 个性化主题（5种主题颜色）

### 2. 学习成就展示
- ✅ 等级和经验值（进度条、徽章）
- ✅ 学习统计（总学习时长、文档数、练习数）
- ✅ 成就墙（获得的所有徽章和成就）
- ✅ 学习日历（GitHub 风格热力图）
- ✅ 技能雷达图（各领域掌握度）
- ✅ 学习里程碑（重要成就时间线）

### 3. 内容展示
- ✅ 我的笔记（公开的知识库文档）
- ✅ 我的动态（发布的学习动态）
- ✅ 我的问答（提问和回答）
- ✅ 我的项目（编程项目展示）
- ✅ 我的收藏（收藏的资源和内容）
- ✅ 我的小组（加入的学习小组）

### 4. 社交信息
- ✅ 关注数/粉丝数
- ✅ 关注列表/粉丝列表
- ✅ 互动统计（点赞数、评论数）
- ✅ 声誉值（问答系统）
- ✅ 贡献度（社区活跃度）

### 5. 隐私设置
- ✅ 公开/私密切换
- ✅ 内容可见性设置
- ✅ 谁可以关注我
- ✅ 谁可以评论我的动态
- ✅ 屏蔽用户列表

## 文件结构

```
apps/web/src/
├── app/
│   ├── profile/
│   │   ├── [username]/
│   │   │   └── page.tsx              # 用户主页
│   │   └── edit/
│   │       └── page.tsx              # 编辑资料页
│
├── components/
│   └── profile/
│       ├── profile-header.tsx        # 个人资料头部
│       ├── achievement-wall.tsx      # 成就墙
│       ├── learning-stats.tsx        # 学习统计
│       ├── content-tabs.tsx          # 内容标签页
│       ├── skill-radar.tsx           # 技能雷达图
│       └── learning-calendar-heatmap.tsx  # 学习日历热力图
│
└── lib/
    └── profile/
        ├── profile-types.ts          # 类型定义
        ├── profile-storage.ts        # 数据存储服务
        └── sample-data.ts            # 示例数据初始化
```

## 快速开始

### 1. 初始化示例数据

在浏览器控制台运行：

```javascript
import { initializeProfileSampleData } from '@/lib/profile/sample-data';
initializeProfileSampleData();
```

或在应用启动时自动初始化（已在主页中集成）。

### 2. 访问用户主页

访问以下链接查看示例用户主页：

- `/profile/alice_chen` - 陈小雅（全栈开发者）
- `/profile/bob_wang` - 王大明（算法竞赛选手）
- `/profile/carol_li` - 李晓晓（数学教师）

### 3. 编辑个人资料

访问 `/profile/edit` 编辑当前用户的个人资料。

## 使用示例

### 获取用户资料

```typescript
import { getUserProfile } from '@/lib/profile/profile-storage';

const profile = getUserProfile('user_id');
```

### 更新用户资料

```typescript
import { updateUserProfile } from '@/lib/profile/profile-storage';

updateUserProfile('user_id', {
  displayName: '新名字',
  bio: '新的个人简介',
  interests: ['前端开发', 'AI']
});
```

### 关注/取消关注用户

```typescript
import { followUser, unfollowUser, isFollowing } from '@/lib/profile/profile-storage';

// 关注用户
followUser('follower_id', 'following_id');

// 取消关注
unfollowUser('follower_id', 'following_id');

// 检查是否关注
const following = isFollowing('follower_id', 'following_id');
```

### 添加用户动态

```typescript
import { addActivity } from '@/lib/profile/profile-storage';

addActivity({
  userId: 'user_id',
  type: 'note_created',
  title: '创建了新笔记',
  description: '笔记内容摘要',
  isPublic: true
});
```

### 更新学习日历

```typescript
import { updateLearningCalendar } from '@/lib/profile/profile-storage';

// 记录今天学习了 60 分钟
updateLearningCalendar('user_id', '2024-12-10', 60);
```

### 添加里程碑

```typescript
import { addMilestone } from '@/lib/profile/profile-storage';

addMilestone({
  userId: 'user_id',
  type: 'level_up',
  title: '达到 20 级',
  description: '成为学习大师',
  icon: '⬆️'
});
```

## 数据类型

### UserProfile

```typescript
type UserProfile = {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  signature?: string;
  school?: string;
  company?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  blog?: string;
  interests: string[];
  skills: string[];
  theme?: 'default' | 'dark' | 'blue' | 'green' | 'purple';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### UserSocialStats

```typescript
type UserSocialStats = {
  userId: string;
  followingCount: number;
  followersCount: number;
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  reputation: number;
  contributionScore: number;
  updatedAt: string;
};
```

### PrivacySettings

```typescript
type PrivacySettings = {
  userId: string;
  profileVisibility: 'public' | 'followers' | 'private';
  showEmail: boolean;
  showSocialLinks: boolean;
  showLearningStats: boolean;
  showAchievements: boolean;
  showActivities: boolean;
  allowFollow: boolean;
  allowComments: boolean;
  blockedUsers: string[];
  updatedAt: string;
};
```

## 主题定制

系统支持 5 种主题颜色：

1. **Default** - 灰色渐变
2. **Dark** - 深色渐变
3. **Blue** - 蓝色渐变
4. **Green** - 绿色渐变
5. **Purple** - 紫色渐变

用户可以在编辑资料页面选择喜欢的主题颜色。

## 学习日历热力图

类似 GitHub 贡献图的学习日历：

- 显示过去 365 天的学习记录
- 5 个等级的颜色深度（0-4）
- 悬停显示具体日期和学习时长
- 显示总学习天数、总时长、最长连续天数

等级划分：
- Level 0: 0 分钟（灰色）
- Level 1: 1-29 分钟（浅绿）
- Level 2: 30-59 分钟（中绿）
- Level 3: 60-119 分钟（深绿）
- Level 4: 120+ 分钟（最深绿）

## 技能雷达图

展示用户在不同技能领域的掌握程度：

- 支持 3-8 个技能维度
- 可视化展示各技能的相对水平
- 包含详细的百分比进度条

## 成就墙

展示用户获得的所有徽章和成就：

- 按类别筛选（学习、练习、社区、特殊）
- 已获得 / 进行中 两个标签页
- 显示解锁时间和进度
- 徽章分类颜色标识

## 注意事项

1. **数据存储**：当前使用 localStorage 存储数据，生产环境需要替换为后端 API
2. **用户认证**：需要集成实际的用户认证系统
3. **图片上传**：封面图片和头像需要实现图片上传功能
4. **实时更新**：社交统计需要实时更新机制
5. **隐私保护**：确保隐私设置正确应用到所有功能

## 后续优化

- [ ] 集成后端 API
- [ ] 实现图片上传功能
- [ ] 添加关注列表/粉丝列表页面
- [ ] 实现用户搜索功能
- [ ] 添加用户互动功能（点赞、评论）
- [ ] 实现消息通知系统
- [ ] 添加数据导出功能
- [ ] 优化移动端体验
- [ ] 添加分享功能
- [ ] 实现用户推荐算法

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **类型检查**: TypeScript
- **数据可视化**: SVG + Canvas

## 贡献

欢迎提交 Issue 和 Pull Request！
