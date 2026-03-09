# 学习报告生成系统 - 快速开始

## 功能概览

学习报告生成系统提供全面的学习数据分析和个性化建议：

- ✅ **周报生成** - 每周学习总结和趋势分析
- ✅ **月报生成** - 月度学习概览和知识掌握度
- ✅ **AI 建议** - 基于数据的个性化学习建议
- ✅ **活动追踪** - 自动记录学习会话和活动
- ✅ **数据可视化** - 精美的图表展示学习进展
- ✅ **报告导出** - 支持 PDF 导出和分享

## 快速访问

访问报告页面：
```
http://localhost:3000/workspace/analytics/reports
```

## 核心文件

### 数据追踪
- `apps/web/src/lib/analytics/learning-session.ts` - 学习会话追踪
- `apps/web/src/lib/analytics/report-generator.ts` - 报告生成器

### 前端组件
- `apps/web/src/components/analytics/weekly-report.tsx` - 周报组件
- `apps/web/src/components/analytics/monthly-report.tsx` - 月报组件
- `apps/web/src/components/analytics/ai-suggestions.tsx` - AI 建议组件

### API 路由
- `apps/web/src/app/api/analytics/weekly-report/route.ts` - 周报 API
- `apps/web/src/app/api/analytics/monthly-report/route.ts` - 月报 API
- `apps/web/src/app/api/analytics/insights/route.ts` - AI 洞察 API

### 页面
- `apps/web/src/app/workspace/analytics/reports/page.tsx` - 报告主页面

## 使用示例

### 1. 追踪学习会话

```typescript
import { sessionTracker } from '@/lib/analytics/learning-session';

// 开始学习会话
const sessionId = sessionTracker.startSession(
  'user123',
  'document_edit',
  { documentId: 'doc1', documentTitle: 'React 学习笔记' }
);

// 结束会话
const session = sessionTracker.endSession(sessionId);
console.log(`学习时长: ${session.duration} 分钟`);
```

### 2. 生成报告

```typescript
import { generateWeeklyReport } from '@/lib/analytics/report-generator';

const report = generateWeeklyReport(sessions, userStats);
console.log(`本周学习: ${report.summary.totalStudyTime} 分钟`);
```

### 3. 获取 AI 建议

```typescript
import { generateLearningInsights } from '@/lib/analytics/report-generator';

const insights = generateLearningInsights(sessions, userStats);
console.log('学习建议:', insights.recommendations);
```

## API 使用

### 获取周报
```bash
GET /api/analytics/weekly-report?userId=user123&date=2026-03-09
```

### 获取月报
```bash
GET /api/analytics/monthly-report?userId=user123&date=2026-03-01
```

### 获取 AI 洞察
```bash
GET /api/analytics/insights?userId=user123&period=month
```

## 数据结构

### 学习会话
```typescript
{
  sessionId: "session_123",
  userId: "user123",
  startTime: "2026-03-09T10:00:00Z",
  endTime: "2026-03-09T11:30:00Z",
  duration: 90, // 分钟
  activityType: "document_edit",
  metadata: {
    documentId: "doc1",
    documentTitle: "React 学习笔记"
  }
}
```

### 周报
```typescript
{
  period: {
    start: "2026-03-03",
    end: "2026-03-09",
    weekNumber: 10
  },
  summary: {
    totalStudyTime: 720,
    avgDailyTime: 103,
    totalSessions: 28,
    practiceAccuracy: 82
  },
  achievements: ["本周学习超过10小时"],
  suggestions: ["建议增加练习量"]
}
```

## 功能特性

### 📊 数据统计
- 学习时长追踪（按日/周/月）
- 文档创建/编辑次数
- 练习完成情况和正确率
- 知识点掌握度分析

### 📈 可视化图表
- 学习时长趋势图
- 活动频率柱状图
- 知识掌握雷达图
- 学习活跃度热力图

### 🎯 智能分析
- 学习模式识别
- 优势和薄弱点分析
- 个性化学习建议
- 下一步行动计划

### 📄 报告导出
- 精美的报告页面
- PDF 导出功能
- 分享报告链接
- 历史报告查看

## 测试

运行测试脚本：
```bash
node apps/web/scripts/test-reports.mjs
```

## 下一步

1. 访问 `/workspace/analytics/reports` 查看报告
2. 查看 `docs/LEARNING_REPORTS.md` 了解详细文档
3. 根据需要自定义报告模板和 AI 建议逻辑

## 注意事项

- 当前使用模拟数据，实际应用需要集成真实的数据库
- AI 建议基于规则系统，可以扩展为机器学习模型
- 确保用户隐私和数据安全

## 技术栈

- React + TypeScript
- Recharts (图表库)
- shadcn/ui (UI 组件)
- Next.js App Router
- Tailwind CSS

## 支持

如有问题，请查看：
- 详细文档: `docs/LEARNING_REPORTS.md`
- 代码示例: `apps/web/scripts/test-reports.mjs`