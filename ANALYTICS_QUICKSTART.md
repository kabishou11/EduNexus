# EduNexus 高级分析系统 - 快速开始

## 🚀 快速开始

### 1. 查看分析仪表板

访问分析页面：
```
http://localhost:3000/workspace/analytics
```

### 2. 使用 API

#### 获取统计数据
```bash
curl http://localhost:3000/api/analytics/stats?range=week
```

#### 获取 AI 洞察
```bash
curl http://localhost:3000/api/analytics/insights?range=month
```

#### 生成报告
```bash
curl http://localhost:3000/api/analytics/reports?type=weekly
```

#### 导出数据
```bash
curl -X POST http://localhost:3000/api/analytics/export \
  -H "Content-Type: application/json" \
  -d '{
    "format": "json",
    "reportType": "weekly",
    "dateRange": {
      "start": "2026-03-01",
      "end": "2026-03-10"
    }
  }'
```

### 3. 在代码中使用

#### 使用分析引擎
```typescript
import { AnalyticsEngine, createTimeRange } from '@/lib/analytics/analytics-engine';

// 创建时间范围
const timeRange = createTimeRange('week');

// 获取会话数据
const sessions = await getSessions(userId, timeRange);

// 执行分析
const behaviorAnalysis = AnalyticsEngine.analyzeLearningBehavior(sessions, timeRange);
const insights = AnalyticsEngine.generateInsights(sessions, behaviorAnalysis);
const metrics = AnalyticsEngine.calculateMetrics(sessions);
```

#### 生成报告
```typescript
import {
  generateDailyReport,
  generateEnhancedWeeklyReport,
  generateEnhancedMonthlyReport,
  generateYearlyReport,
} from '@/lib/analytics/report-builder';

// 生成日报
const dailyReport = generateDailyReport(sessions, new Date());

// 生成周报
const weeklyReport = generateEnhancedWeeklyReport(sessions);

// 生成月报
const monthlyReport = generateEnhancedMonthlyReport(sessions);

// 生成年报
const yearlyReport = generateYearlyReport(sessions, 2026);
```

#### 导出数据
```typescript
import {
  exportToJSON,
  exportToCSV,
  exportReportAsText,
  downloadExport,
} from '@/lib/analytics/export-manager';

// 导出为 JSON
const jsonResult = exportToJSON(data, 'analytics_report');
downloadExport(jsonResult);

// 导出为 CSV
const csvResult = exportToCSV(sessions, 'learning_sessions');
downloadExport(csvResult);

// 导出报告为文本
const textResult = exportReportAsText(weeklyReport, 'weekly');
downloadExport(textResult);
```

#### 使用 React 组件
```typescript
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { AIInsightsPanel } from '@/components/analytics/ai-insights-panel';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <AnalyticsDashboard userId="user_123" />
    </div>
  );
}
```

## 📊 核心功能

### 学习行为分析
- ✅ 时间分析（每日、每周、每月）
- ✅ 效率分析（专注度、完成率）
- ✅ 习惯分析（最佳学习时段、学习节奏）
- ✅ 知识掌握度分析
- ✅ 学习路径分析

### AI 驱动的洞察
- ✅ 学习模式识别
- ✅ 个性化建议
- ✅ 预测分析
- ✅ 异常检测
- ✅ 对比分析

### 可视化仪表板
- ✅ 综合仪表板
- ✅ 学习趋势图表
- ✅ 知识分布雷达图
- ✅ 学习热力图
- ✅ AI 洞察面板

### 报告生成
- ✅ 日报
- ✅ 周报
- ✅ 月报
- ✅ 年度报告
- ✅ 自定义报告

### 数据导出和分享
- ✅ JSON 导出
- ✅ CSV 导出
- ✅ 文本报告导出
- ✅ 报告分享
- ✅ 社交分享

## 📁 文件结构

```
apps/web/src/
├── lib/analytics/              # 核心分析库
│   ├── analytics-types.ts      # 类型定义
│   ├── data-aggregator.ts      # 数据聚合
│   ├── insight-generator.ts    # AI 洞察生成
│   ├── analytics-engine.ts     # 分析引擎
│   ├── report-builder.ts       # 报告构建
│   └── export-manager.ts       # 导出管理
├── app/api/analytics/          # API 路由
│   ├── stats/route.ts          # 统计数据
│   ├── insights/route.ts       # AI 洞察
│   ├── reports/route.ts        # 报告生成
│   └── export/route.ts         # 数据导出
└── components/analytics/       # React 组件
    ├── analytics-dashboard.tsx # 分析仪表板
    ├── ai-insights-panel.tsx   # AI 洞察面板
    ├── learning-chart.tsx      # 学习趋势图
    └── activity-heatmap.tsx    # 活动热力图
```

## 📖 文档

- [完整文档](./docs/ADVANCED_ANALYTICS.md) - 详细的功能说明和 API 文档
- [实现总结](./ANALYTICS_IMPLEMENTATION_SUMMARY.md) - 实现完成情况
- [组件文档](./apps/web/src/components/analytics/README.md) - React 组件使用说明

## 🔧 技术栈

- **TypeScript** - 类型安全
- **Next.js** - React 框架
- **Recharts** - 数据可视化
- **Tailwind CSS** - 样式
- **shadcn/ui** - UI 组件库

## 📈 关键指标

### 学习时长
- 总学习时长
- 日均学习时长
- 学习趋势

### 效率指标
- 专注度评分 (0-100)
- 完成率 (0-100)
- 生产力指数 (0-100)

### 习惯指标
- 学习一致性 (0-100)
- 连续学习天数
- 最佳学习时段

### 知识指标
- 整体掌握度 (0-100)
- 知识点数量
- 薄弱点数量

## 💡 AI 洞察示例

### 学习模式
- "你在晚上 8-10 点的学习效率最高（85%）"
- "你已经连续学习 7 天，保持这个节奏！"
- "学习时长增长 20%，保持良好势头"

### 个性化建议
- "建议使用番茄工作法，每次专注学习 25-50 分钟"
- "Python 基础知识掌握度 65%，建议重点加强"
- "建立固定的学习时间，提高学习一致性"

### 预测分析
- "按照当前趋势，你有 85% 的可能性达成本月学习目标"
- "预计在 2 周内，你将完全掌握 3 个正在进步的知识点"

## 🎯 下一步

1. 访问 `/workspace/analytics` 查看分析仪表板
2. 尝试不同的时间范围（周/月）
3. 查看 AI 洞察和建议
4. 生成和导出报告
5. 根据建议优化学习方法

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**开始使用 EduNexus 高级分析系统，深入了解你的学习行为，优化学习效率！** 🚀
