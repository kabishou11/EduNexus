# 用户主页系统 - 快速启动指南

## 🚀 快速开始

### 1. 运行测试脚本

验证系统功能是否正常：

```bash
node apps/web/scripts/test-profile-system.mjs
```

### 2. 初始化示例数据

在浏览器中打开应用，然后在控制台运行：

```javascript
// 方法 1: 直接在控制台运行
localStorage.clear(); // 清除旧数据（可选）

// 初始化示例数据的代码已集成到主页中
// 访问任意用户主页时会自动初始化
```

或者在代码中调用：

```typescript
import { initializeProfileSampleData } from '@/lib/profile/sample-data';

// 在组件中调用
useEffect(() => {
  initializeProfileSampleData();
}, []);
```

### 3. 访问示例用户主页

打开浏览器访问以下链接：

- **陈小雅** (全栈开发者): `http://localhost:3000/profile/alice_chen`
- **王大明** (算法竞赛选手): `http://localhost:3000/profile/bob_wang`
- **李晓晓** (数学教师): `http://localhost:3000/profile/carol_li`

### 4. 编辑个人资料

访问编辑页面：`http://localhost:3000/profile/edit`

## 📋 功能演示

### 个人资料头部
- 封面图片和头像
- 用户名、显示名、等级徽章
- 关注/粉丝/获赞等统计
- 个人简介和详细信息
- 社交链接（GitHub、Twitter、博客）
- 兴趣标签

### 学习日历热力图
- GitHub 风格的 365 天学习记录
- 5 个等级的颜色深度
- 悬停显示详细信息
- 统计总学习天数、时长、最长连续天数

### 内容标签页
1. **笔记** - 用户公开的知识库文档
2. **动态** - 用户的学习动态和活动
3. **项目** - 编程项目展示
4. **小组** - 加入的学习小组

### 学习统计
- 等级进度条
- 学习时长、笔记数、练习题、连续学习天数
- 详细数据（知识点、路径、测验、社区贡献等）

### 成就墙
- 按类别筛选（学习、练习、社区、特殊）
- 已获得 / 进行中 两个标签页
- 显示徽章图标、名称、描述、经验奖励
- 进度条显示未完成成就的进度

### 技能雷达图
- 可视化展示 6 个技能维度
- 雷达图 + 进度条双重展示
- 百分比显示各技能掌握度

## 🎨 主题定制

在编辑资料页面可以选择 5 种主题颜色：

1. **Default** - 灰色渐变 (适合专业风格)
2. **Dark** - 深色渐变 (适合夜间模式)
3. **Blue** - 蓝色渐变 (清新科技风)
4. **Green** - 绿色渐变 (自然活力风)
5. **Purple** - 紫色渐变 (创意艺术风)

## 🔒 隐私设置

在编辑资料页面的"隐私设置"标签页可以配置：

- ✅ 显示邮箱地址
- ✅ 显示社交链接
- ✅ 显示学习统计
- ✅ 显示成就徽章
- ✅ 显示动态
- ✅ 允许他人关注
- ✅ 允许评论

## 📊 数据管理

### 查看存储数据

在浏览器控制台运行：

```javascript
// 查看所有用户资料
console.log(JSON.parse(localStorage.getItem('edunexus_user_profiles')));

// 查看社交统计
console.log(JSON.parse(localStorage.getItem('edunexus_social_stats')));

// 查看学习日历
console.log(JSON.parse(localStorage.getItem('edunexus_learning_calendar')));
```

### 清除所有数据

```javascript
import { clearProfileSampleData } from '@/lib/profile/sample-data';
clearProfileSampleData();
```

或直接清除 localStorage：

```javascript
localStorage.clear();
```

## 🧪 测试场景

### 场景 1: 查看他人主页
1. 访问 `/profile/alice_chen`
2. 查看用户的学习成就和内容
3. 点击"关注"按钮
4. 查看关注数变化

### 场景 2: 编辑个人资料
1. 访问 `/profile/edit`
2. 修改显示名称、个性签名
3. 添加兴趣标签和技能标签
4. 选择主题颜色
5. 点击"保存"
6. 返回主页查看更新

### 场景 3: 隐私设置
1. 访问 `/profile/edit`
2. 切换到"隐私设置"标签
3. 关闭"显示学习统计"
4. 保存并返回主页
5. 验证学习统计是否隐藏

### 场景 4: 学习日历
1. 查看学习日历热力图
2. 悬停在不同日期上查看详情
3. 观察颜色深度变化
4. 查看统计数据（总天数、时长、连续天数）

## 🐛 常见问题

### Q: 访问用户主页显示"用户不存在"？
A: 确保已初始化示例数据。在控制台运行 `initializeProfileSampleData()`。

### Q: 编辑资料后没有保存？
A: 检查浏览器控制台是否有错误。确保 localStorage 可用。

### Q: 学习日历没有数据？
A: 示例数据会自动生成 365 天的学习记录。如果没有，重新运行初始化脚本。

### Q: 主题颜色没有生效？
A: 刷新页面或清除缓存后重试。

### Q: 关注功能不工作？
A: 确保 currentUserId 设置正确，且不是关注自己。

## 📝 开发提示

### 添加新的用户动态类型

在 `profile-types.ts` 中添加新类型：

```typescript
type UserActivity = {
  // ...
  type: 'note_created' | 'note_updated' | 'your_new_type';
  // ...
};
```

在 `content-tabs.tsx` 中添加图标和标签：

```typescript
const activityIcons = {
  // ...
  your_new_type: '🎉'
};

const activityLabels = {
  // ...
  your_new_type: '你的新动态'
};
```

### 自定义技能雷达图

在用户主页中修改 `skillRadarData`：

```typescript
const skillRadarData: SkillRadarData[] = [
  { skill: '你的技能1', value: 85, maxValue: 100 },
  { skill: '你的技能2', value: 72, maxValue: 100 },
  // 添加更多技能...
];
```

### 集成后端 API

替换 localStorage 调用为 API 调用：

```typescript
// 之前
const profile = getUserProfile(userId);

// 之后
const profile = await fetch(`/api/profile/${userId}`).then(r => r.json());
```

## 🎯 下一步

1. ✅ 系统已完成基础功能
2. 🔄 集成后端 API
3. 📸 实现图片上传
4. 💬 添加评论功能
5. 🔔 实现通知系统
6. 🔍 添加用户搜索
7. 📱 优化移动端体验

## 📚 相关文档

- [用户主页系统完整文档](./USER_PROFILE_SYSTEM.md)
- [用户等级系统](./USER_LEVEL_SYSTEM.md)
- [徽章系统配置](../apps/web/src/lib/server/badge-config.ts)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**祝你使用愉快！** 🎉
