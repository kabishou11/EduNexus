# EduNexus 高级分析系统 (Advanced Analytics)

## 概述

EduNexus 高级分析系统是一个全面的学习数据分析平台，提供深入的学习行为分析、AI 驱动的洞察、可视化仪表板和智能报告生成功能。

## 核心功能

### 1. 学习行为分析

#### 1.1 时间分析
- **每日分析**: 日均学习时长、总时长、趋势分析
- **每周分析**: 周均学习时长、周趋势
- **每月分析**: 月均学习时长、月趋势
- **高峰时段**: 识别最佳学习时段和效率最高的时间段

#### 1.2 效率分析
- **专注度评分** (0-100): 基于会话长度和完成情况
- **完成率**: 任务和练习的完成百分比
- **平均会话长度**: 单次学习时长统计
- **生产力指数**: 综合评估学习效率
- **分心率**: 识别学习中的干扰因素

#### 1.3 习惯分析
- **最佳学习时段**: 上午/下午/晚上/深夜
- **学习节奏**:
  - 一致性评分 (0-100)
  - 学习模式: 规律/不规律/周末战士/夜猫子
  - 偏好学习时长
- **连续学习**: 当前连续天数、最长连续天数、平均连续天数

#### 1.4 知识掌握度分析
- **整体掌握度**: 所有知识点的平均掌握程度
- **分类掌握度**: 按类别统计知识点掌握情况
- **知识点详情**: 每个知识点的掌握度、练习次数、趋势
- **薄弱点识别**: 自动识别需要加强的知识点
- **优势点展示**: 展示已掌握的知识点

#### 1.5 学习路径分析
- **完成率**: 路径整体完成百分比
- **进度追踪**: 是否按计划进行
- **瓶颈识别**: 发现学习路径中的难点
- **里程碑追踪**: 记录重要学习节点

### 2. AI 驱动的洞察

#### 2.1 学习模式识别
系统自动发现以下学习模式：
- **时间模式**: 最佳学习时段、学习时长趋势
- **行为模式**: 学习习惯、连续学习模式
- **效率模式**: 学习效率变化趋势
- **知识模式**: 知识掌握进度和趋势

每个模式包含：
- 模式描述
- 置信度 (0-100)
- 影响程度 (高/中/低)
- 发现时间

#### 2.2 个性化建议
基于数据分析生成的智能建议：

**时间管理建议**:
- 延长学习时长
- 优化学习时间安排
- 使用番茄工作法

**学习方法建议**:
- 提高专注度
- 改善学习环境
- 采用主动学习法

**知识点建议**:
- 重点突破薄弱知识点
- 巩固已学知识
- 扩展知识领域

**习惯养成建议**:
- 建立固定学习时间
- 提高学习一致性
- 培养长期习惯

每个建议包含：
- 优先级 (高/中/低)
- 详细描述
- 具体行动步骤
- 预期效果
- 推理依据

#### 2.3 预测分析
基于历史数据的智能预测：
- **目标达成预测**: 预测目标完成可能性
- **知识掌握预测**: 预测知识点掌握时间
- **学习时长预测**: 预测未来学习时长

每个预测包含：
- 预测内容
- 置信度 (0-100)
- 时间范围
- 影响因素

#### 2.4 异常检测
自动检测学习中的异常情况：
- **时间异常**: 学习时长显著下降
- **效率异常**: 专注度过低
- **表现异常**: 完成率偏低

每个异常包含：
- 严重程度 (高/中/低)
- 详细描述
- 改进建议

#### 2.5 对比分析
与历史数据的对比：
- 学习时长对比
- 专注度对比
- 完成率对比
- 知识掌握度对比

### 3. 可视化仪表板

#### 3.1 综合仪表板
- 关键指标卡片
- 学习趋势图表
- AI 洞察面板
- 快速操作按钮

#### 3.2 学习趋势图表
- **折线图**: 学习时长趋势
- **柱状图**: 活动频率分布
- **饼图**: 学习领域分布、练习正确率
- **雷达图**: 知识点掌握度

#### 3.3 时间热力图
- 按日期和小时显示学习活动
- 颜色深度表示学习强度
- 快速识别学习模式

#### 3.4 进度漏斗图
- 学习路径各阶段完成情况
- 识别流失点
- 优化学习路径

#### 3.5 成就墙
- 展示获得的成就
- 里程碑记录
- 激励持续学习

### 4. 报告生成

#### 4.1 日报
**内容**:
- 学习概况 (时长、活动、专注度)
- 活动详情
- 今日成就
- 洞察
- 明日计划

**生成方式**:
```typescript
const report = generateDailyReport(sessions, new Date());
```

#### 4.2 周报
**内容**:
- 学习统计 (总时长、平均时长、会话数)
- 每日数据分解
- 主要活动类型
- 知识进度
- 本周成就
- 洞察和建议
- 下周计划

**生成方式**:
```typescript
const report = generateEnhancedWeeklyReport(sessions);
```

#### 4.3 月报
**内容**:
- 学习统计
- 周趋势
- 主要活动类型
- 知识掌握度
- 里程碑
- 本月成就
- 洞察和建议
- 下月计划

**生成方式**:
```typescript
const report = generateEnhancedMonthlyReport(sessions);
```

#### 4.4 年度报告
**内容**:
- 年度统计
- 月度趋势
- 主要学习领域
- 年度亮点
- 年度成就
- 成长领域
- 明年展望

**生成方式**:
```typescript
const report = generateYearlyReport(sessions, 2026);
```

#### 4.5 自定义报告
支持自定义时间范围和指标的报告生成。

### 5. 数据导出和分享

#### 5.1 数据导出格式
- **JSON**: 完整的结构化数据
- **CSV**: 表格数据，适合 Excel 分析
- **TXT**: 文本格式报告，易于阅读

#### 5.2 导出示例
```typescript
// 导出为 JSON
const result = exportToJSON(data, 'analytics_report');

// 导出为 CSV
const result = exportToCSV(sessions, 'learning_sessions');

// 导出报告为文本
const result = exportReportAsText(report, 'weekly');

// 下载文件
downloadExport(result);
```

#### 5.3 报告分享
```typescript
// 生成分享链接
const shareResult = await generateShareLink({
  reportType: 'weekly',
  reportId: 'report_123',
  privacy: 'unlisted',
  expiresIn: 24, // 24小时后过期
  includePersonalInfo: false,
});

// 复制到剪贴板
await copyToClipboard(shareResult.shareUrl);

// 分享到社交平台
shareToSocial('weibo', '我的学习周报', shareResult.shareUrl);
```

#### 5.4 数据隐私控制
- 选择是否包含个人信息
- 设置分享链接过期时间
- 控制分享权限 (公开/私有/不公开)

## 技术架构

### 核心模块

#### 1. 类型定义 (`analytics-types.ts`)
定义所有分析相关的 TypeScript 类型。

#### 2. 数据聚合器 (`data-aggregator.ts`)
负责从原始会话数据聚合分析数据：
- `aggregateTimeAnalysis()`: 时间分析
- `aggregateEfficiencyAnalysis()`: 效率分析
- `aggregateHabitAnalysis()`: 习惯分析
- `aggregateKnowledgeMastery()`: 知识掌握度分析
- `generateHeatmapData()`: 热力图数据生成

#### 3. 洞察生成器 (`insight-generator.ts`)
生成 AI 驱动的洞察：
- `generateAIInsights()`: 生成完整洞察
- `discoverLearningPatterns()`: 发现学习模式
- `generateRecommendations()`: 生成建议
- `generatePredictions()`: 生成预测
- `detectAnomalies()`: 检测异常
- `generateComparisons()`: 生成对比分析

#### 4. 分析引擎 (`analytics-engine.ts`)
核心分析逻辑：
- `analyzeLearningBehavior()`: 执行完整行为分析
- `generateInsights()`: 生成洞察
- `calculateMetrics()`: 计算指标
- `generateHeatmap()`: 生成热力图
- `getSessionsInRange()`: 获取时间范围内的会话

#### 5. 报告构建器 (`report-builder.ts`)
生成各种报告：
- `generateDailyReport()`: 日报
- `generateEnhancedWeeklyReport()`: 周报
- `generateEnhancedMonthlyReport()`: 月报
- `generateYearlyReport()`: 年报

#### 6. 导出管理器 (`export-manager.ts`)
处理数据导出和分享：
- `exportToJSON()`: 导出为 JSON
- `exportToCSV()`: 导出为 CSV
- `exportReportAsText()`: 导出报告为文本
- `downloadExport()`: 下载导出文件
- `generateShareLink()`: 生成分享链接
- `shareToSocial()`: 分享到社交平台

### API 路由

#### 1. 统计数据 API
```
GET /api/analytics/stats?range=week
```
返回学习统计数据、行为分析和指标。

#### 2. 洞察 API
```
GET /api/analytics/insights?range=month
```
返回 AI 驱动的洞察。

#### 3. 报告 API
```
GET /api/analytics/reports?type=weekly&date=2026-03-10
```
生成指定类型的报告。

#### 4. 导出 API
```
POST /api/analytics/export
Body: {
  format: 'json' | 'csv' | 'text',
  reportType: 'daily' | 'weekly' | 'monthly' | 'yearly',
  dateRange: { start: string, end: string }
}
```
导出分析数据。

### React 组件

#### 1. AnalyticsDashboard
主仪表板组件，整合所有分析功能。

#### 2. AIInsightsPanel
AI 洞察面板，展示模式、建议、预测和异常。

#### 3. LearningChart
学习趋势图表组件（已存在）。

#### 4. ActivityHeatmap
活动热力图组件（已存在）。

## 使用示例

### 基础使用

```typescript
import { AnalyticsEngine, createTimeRange } from '@/lib/analytics/analytics-engine';
import { generateEnhancedWeeklyReport } from '@/lib/analytics/report-builder';

// 创建时间范围
const timeRange = createTimeRange('week');

// 获取会话数据
const sessions = await getSessions(userId, timeRange);

// 执行分析
const behaviorAnalysis = AnalyticsEngine.analyzeLearningBehavior(sessions, timeRange);
const insights = AnalyticsEngine.generateInsights(sessions, behaviorAnalysis);
const metrics = AnalyticsEngine.calculateMetrics(sessions);

// 生成报告
const weeklyReport = generateEnhancedWeeklyReport(sessions);

// 导出报告
const exportResult = exportReportAsText(weeklyReport, 'weekly');
downloadExport(exportResult);
```

### 在 React 组件中使用

```typescript
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <AnalyticsDashboard userId="user_123" />
    </div>
  );
}
```

## 分析指标说明

### 学习时长指标
- **总学习时长**: 所有会话的累计时长
- **平均学习时长**: 总时长除以天数
- **最长学习时长**: 单次会话的最长时长
- **最短学习时长**: 单次会话的最短时长

### 频率指标
- **学习天数**: 有学习活动的天数
- **连续天数**: 当前连续学习的天数
- **最长连续**: 历史最长连续学习天数

### 完成率指标
- **目标完成率**: 完成的目标占总目标的百分比
- **路径完成率**: 完成的路径占总路径的百分比
- **练习完成率**: 完成的练习占总练习的百分比

### 正确率指标
- **练习正确率**: 练习题的正确率
- **测试正确率**: 测试题的正确率
- **整体正确率**: 所有题目的正确率

### 知识指标
- **知识点掌握数**: 掌握的知识点数量
- **平均掌握度**: 所有知识点的平均掌握程度
- **覆盖类别数**: 涉及的知识类别数量

### 效率指标
- **学习效率**: 单位时间的学习量
- **专注时间**: 有效学习时间
- **休息时间**: 休息和中断时间

## 最佳实践

### 1. 数据收集
- 确保准确记录学习会话
- 及时更新会话元数据
- 定期清理无效数据

### 2. 分析频率
- 每日查看关键指标
- 每周生成周报
- 每月进行深度分析
- 每年回顾学习成果

### 3. 行动建议
- 重视 AI 建议的优先级
- 逐步改进，不要急于求成
- 定期调整学习计划
- 保持学习习惯的一致性

### 4. 数据隐私
- 不要分享包含个人信息的报告
- 设置合理的分享链接过期时间
- 定期清理过期的分享链接

## 性能优化

### 1. 数据聚合优化
- 使用 Map 和 Set 提高查询效率
- 避免重复计算
- 缓存常用数据

### 2. 大数据量处理
- 分页加载历史数据
- 使用 Web Worker 处理复杂计算
- 实现虚拟滚动

### 3. 图表渲染优化
- 使用 Recharts 的优化选项
- 限制数据点数量
- 按需加载图表

## 未来扩展

### 1. 高级功能
- 学习伙伴对比
- 班级/团队分析
- 学习路径推荐
- 智能学习计划生成

### 2. 可视化增强
- 3D 可视化
- 交互式图表
- 自定义仪表板布局
- 实时数据更新

### 3. AI 增强
- 更精准的预测模型
- 个性化学习建议
- 自动学习计划调整
- 智能知识图谱

### 4. 集成功能
- 导出到第三方工具
- API 开放平台
- 移动端应用
- 桌面通知

## 故障排除

### 常见问题

**Q: 数据不准确怎么办？**
A: 检查会话记录是否完整，确保正确调用 `startSession()` 和 `endSession()`。

**Q: 图表不显示？**
A: 检查数据格式是否正确，确保有足够的数据点。

**Q: 导出失败？**
A: 检查浏览器权限，确保允许下载文件。

**Q: 分享链接无法访问？**
A: 检查链接是否过期，确保分享权限设置正确。

## 总结

EduNexus 高级分析系统提供了全面的学习数据分析能力，通过 AI 驱动的洞察帮助用户更好地了解自己的学习行为，优化学习方法，提高学习效率。系统设计灵活，易于扩展，可以满足不同用户的分析需求。

## 相关文档

- [用户等级系统](./USER_LEVEL_SYSTEM.md)
- [练习系统](./PRACTICE_SYSTEM.md)
- [搜索架构](../SEARCH_ARCHITECTURE.md)
