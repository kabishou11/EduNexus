"use client";

import { useState } from "react";
import {
  TrendingUp,
  Clock,
  FileText,
  Target,
  Award,
  Calendar,
  Download,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningChart } from "@/components/analytics/learning-chart";
import { ActivityHeatmap } from "@/components/analytics/activity-heatmap";
import {
  generateMockStats,
  generateWeeklyReport,
  formatStudyTime,
  type LearningStats,
  type WeeklyReport,
} from "@/lib/analytics/stats";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [stats] = useState<LearningStats>(() => generateMockStats());
  const [weeklyReport] = useState<WeeklyReport>(() => generateWeeklyReport(stats));

  // 导出报告为文本
  const exportReport = (type: "week" | "month") => {
    const report = type === "week" ? generateWeeklyReport(stats) : null;
    if (!report) return;

    const content = `
# 学习周报 (${report.weekStart} - ${report.weekEnd})

## 学习统计
- 总学习时长：${formatStudyTime(report.totalStudyTime)}
- 平均每日：${formatStudyTime(report.avgDailyTime)}

## 知识点掌握
${report.topKnowledgePoints.map((kp, i) => `${i + 1}. ${kp.name}: ${kp.mastery}%`).join("\n")}

## 本周成就
${report.achievements.map((a) => `✓ ${a}`).join("\n")}

## 改进建议
${report.suggestions.map((s) => `• ${s}`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `学习${type === "week" ? "周" : "月"}报_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-rose-50/30">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                学习分析
              </h1>
              <p className="text-muted-foreground mt-2">
                追踪你的学习进度，发现提升空间
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => exportReport("week")}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                导出周报
              </Button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                总学习时长
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatStudyTime(stats.totalStudyTime)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                近30天累计
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                文档统计
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.documentsCreated + stats.documentsEdited}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                创建 {stats.documentsCreated} · 编辑 {stats.documentsEdited}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                练习完成
              </CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quizzesCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                正确率{" "}
                {Math.round((stats.quizzesCorrect / stats.quizzesCompleted) * 100)}%
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                知识点
              </CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.knowledgePoints.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                平均掌握度{" "}
                {Math.round(
                  stats.knowledgePoints.reduce((sum, kp) => sum + kp.mastery, 0) /
                    stats.knowledgePoints.length
                )}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 周期选择 */}
        <div className="mb-6">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week">
                <Calendar className="h-4 w-4 mr-2" />
                本周
              </TabsTrigger>
              <TabsTrigger value="month">
                <Calendar className="h-4 w-4 mr-2" />
                本月
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <LearningChart stats={stats} period={period} />
          </div>

          <div className="space-y-6">
            {/* 周报卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  本周总结
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    学习时长
                  </div>
                  <div className="text-2xl font-bold">
                    {formatStudyTime(weeklyReport.totalStudyTime)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    平均每日 {formatStudyTime(weeklyReport.avgDailyTime)}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <div className="text-sm font-medium mb-2">本周成就</div>
                  <div className="space-y-2">
                    {weeklyReport.achievements.length > 0 ? (
                      weeklyReport.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Award className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        继续努力，争取更多成就！
                      </p>
                    )}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <div className="text-sm font-medium mb-2">改进建议</div>
                  <div className="space-y-2">
                    {weeklyReport.suggestions.length > 0 ? (
                      weeklyReport.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-orange-500">•</span>
                          <span>{suggestion}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        保持当前的学习节奏！
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 知识点排行 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">知识点掌握排行</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyReport.topKnowledgePoints.map((kp, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{kp.name}</span>
                        <Badge variant="secondary">{kp.mastery}%</Badge>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-rose-500 h-2 rounded-full transition-all"
                          style={{ width: `${kp.mastery}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 活动热力图 */}
        <ActivityHeatmap data={stats.dailyActivity} />
      </div>
    </div>
  );
}
