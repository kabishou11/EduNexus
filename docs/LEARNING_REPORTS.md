# 学习报告生成系统

## 概述

学习报告生成系统帮助用户全面了解学习进展，通过数据分析和 AI 建议提供个性化的学习指导。

## 功能特性

### 1. 学习会话追踪

系统自动追踪用户的学习活动，包括：
- 文档创建和编辑
- 练习题完成情况
- AI 对话交互
- 阅读学习时长

**位置**: `apps/web/src/lib/analytics/learning-session.ts`

**核心功能**:
- `startSession()` - 开始新的学习会话
- `endSession()` - 结束学习会话并计算时长
- `updateSessionMetadata()` - 更新会话元数据
- `calculateSessionStats()` - 计算会话统计数据

### 2. 周报生成

每周自动生成学习报告，包含：
- 总学习时长和日均时长
- 文档创建/编辑统计
- 练习完成情况和正确率
- 每日学习趋势图
- 活动类型分布
- 本周成就和洞察
- 学习建议

**API**: `GET /api/analytics/weekly-report?userId=xxx&date=2026-03-09`

**组件**: `apps/web/src/components/analytics/weekly-report.tsx`

### 3. 月报生成

每月生成详细的学习报告，包含：
- 月度学习概览
- 周趋势分析
- 知识点掌握度雷达图
- 学习活动分布
- 月度里程碑和成就
- AI 生成的总结和下月计划

**API**: `GET /api/analytics/monthly-report?userId=xxx&date=2026-03-01`

**组件**: `apps/web/src/components/analytics/monthly-report.tsx`

### 4. AI 学习建议

基于学习数据的 AI 分析，提供：
- 学习模式分析（偏好时段、平均时长、一致性）
- 优势识别
- 薄弱点分析
- 个性化学习建议
- 下一步行动计划
- 推荐学习资源

**API**: `GET /api/analytics/insights?userId=xxx&period=month`

**组件**: `apps/web/src/components/analytics/ai-suggestions.tsx`

### 5. 报告展示和导出

- 精美的报告页面设计
- 支持导出为 PDF（使用浏览器打印功能）
- 支持分享报告链接
- 历史报告查看

**页面**: `apps/web/src/app/workspace/analytics/reports/page.tsx`

## 使用方法

### 访问报告页面

```
/workspace/analytics/reports
```

### 切换报告类型

在页面顶部选择"周报"或"月报"标签。

### 导出 PDF

1. 点击"导出 PDF"按钮
2. 使用浏览器的打印功能
3. 选择"另存为 PDF"

### 分享报告

点击"分享"按钮，使用浏览器的原生分享功能。

### 查看历史报告

在页面底部的"历史报告"卡片中，点击相应的按钮查看上周或上月的报告。

## 数据结构

### LearningSession

```typescript
interface LearningSession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // 分钟
  activityType: 'document_create' | 'document_edit' | 'practice' | 'chat' | 'reading';
  metadata?: {
    documentId?: string;
    documentTitle?: string;
    practiceId?: string;
    questionsCount?: number;
    correctCount?: number;
    knowledgePoints?: string[];
  };
}
```

### WeeklyReport

```typescript
interface WeeklyReport {
  period: {
    start: string;
    end: string;
    weekNumber: number;
  };
  summary: {
    totalStudyTime: number;
    avgDailyTime: number;
    totalSessions: number;
    documentsCreated: number;
    documentsEdited: number;
    practicesCompleted: number;
    practiceAccuracy: number;
  };
  dailyBreakdown: Array<{
    date: string;
    studyTime: number;
    activities: number;
  }>;
  topActivities: Array<{
    type: string;
    duration: number;
    percentage: number;
  }>;
  achievements: string[];
  insights: string[];
  suggestions: string[];
}
```

### MonthlyReport

```typescript
interface MonthlyReport {
  period: {
    start: string;
    end: string;
    month: string;
  };
  summary: {
    totalStudyTime: number;
    avgDailyTime: number;
    totalSessions: number;
    documentsCreated: number;
    documentsEdited: number;
    practicesCompleted: number;
    practiceAccuracy: number;
    knowledgePointsMastered: number;
  };
  weeklyTrend: Array<{
    week: number;
    studyTime: number;
    activities: number;
  }>;
  topActivities: Array<{
    type: string;
    duration: number;
    percentage: number;
  }>;
  knowledgeMastery: Array<{
    name: string;
    mastery: number;
    category: string;
  }>;
  milestones: string[];
  achievements: string[];
  insights: string[];
  recommendations: string[];
}
```

### LearningInsights

```typescript
interface LearningInsights {
  studyPattern: {
    preferredTimeSlots: string[];
    avgSessionLength: number;
    consistency: number; // 0-100
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextSteps: string[];
}
```

## 集成指南

### 1. 追踪学习会话

在用户开始学习活动时：

```typescript
import { sessionTracker } from '@/lib/analytics/learning-session';

// 开始会话
const sessionId = sessionTracker.startSession(
  userId,
  'document_edit',
  { documentId: 'doc123', documentTitle: 'React 学习笔记' }
);

// 结束会话
const session = sessionTracker.endSession(sessionId);

// 保存到数据库
await saveSessionToDb(session);
```

### 2. 更新用户统计

在用户完成学习活动后更新统计数据：

```typescript
import { loadDb, saveDb } from '@/lib/server/store';

const db = await loadDb();
const userStats = db.userStats[userId];

// 更新统计
userStats.learningMinutes += session.duration;
userStats.notesEdited += 1;
userStats.lastActiveDate = new Date().toISOString();

await saveDb(db);
```

### 3. 生成报告

```typescript
import { generateWeeklyReport, generateMonthlyReport } from '@/lib/analytics/report-generator';

// 获取会话数据
const sessions = await getSessionsFromDb(userId, startDate, endDate);
const userStats = await getUserStats(userId);

// 生成周报
const weeklyReport = generateWeeklyReport(sessions, userStats);

// 生成月报
const monthlyReport = generateMonthlyReport(sessions, userStats);
```

## 扩展建议

### 1. 实时数据同步

当前使用模拟数据，建议：
- 实现真实的会话追踪
- 将会话数据持久化到数据库
- 实时更新用户统计数据

### 2. AI 增强

- 集成真实的 AI 模型生成个性化建议
- 基于历史数据预测学习趋势
- 提供更精准的知识点推荐

### 3. 社交功能

- 支持与好友比较学习进度
- 学习排行榜
- 学习小组报告

### 4. 导出增强

- 支持导出为 Word/Excel 格式
- 自定义报告模板
- 定期自动发送报告邮件

## 注意事项

1. **数据准确性**: 确保学习会话数据准确记录，避免重复或遗漏
2. **性能优化**: 对于大量历史数据，考虑分页加载和缓存
3. **隐私保护**: 用户学习数据敏感，需要严格的权限控制
4. **移动端适配**: 确保报告在移动设备上也能良好展示

## 技术栈

- **前端**: React, TypeScript, Tailwind CSS
- **图表**: Recharts
- **UI 组件**: shadcn/ui
- **数据处理**: 自定义分析算法
- **AI 建议**: 基于规则的推荐系统（可扩展为 ML 模型）

## 维护和更新

- 定期检查报告生成逻辑的准确性
- 根据用户反馈优化 AI 建议算法
- 更新图表样式和交互体验
- 添加新的统计维度和分析指标