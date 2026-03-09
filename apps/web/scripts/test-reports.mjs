#!/usr/bin/env node

/**
 * 学习报告生成系统测试脚本
 * 用于验证报告生成功能是否正常工作
 */

import { generateWeeklyReport, generateMonthlyReport, generateLearningInsights } from '../src/lib/analytics/report-generator.js';
import { calculateSessionStats } from '../src/lib/analytics/learning-session.js';

// 模拟用户统计数据
const mockUserStats = {
  userId: 'test_user',
  learningMinutes: 3000,
  notesCreated: 25,
  notesEdited: 60,
  practiceCorrect: 80,
  practiceWrong: 20,
  knowledgePointsMastered: 15,
  pathsCompleted: 3,
  quizzesPassed: 12,
  postsCount: 5,
  answersCount: 10,
  answersAccepted: 7,
  likesReceived: 15,
  notesShared: 8,
  currentStreak: 7,
  longestStreak: 21,
  lastActiveDate: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 生成模拟会话数据
function generateMockSessions(days = 30) {
  const sessions = [];
  const activityTypes = ['document_create', 'document_edit', 'practice', 'chat', 'reading'];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    // 每天 2-5 个会话
    const sessionsPerDay = Math.floor(Math.random() * 4) + 2;

    for (let j = 0; j < sessionsPerDay; j++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const duration = Math.floor(Math.random() * 60) + 20;

      sessions.push({
        sessionId: `session_${date.getTime()}_${j}`,
        userId: 'test_user',
        startTime: date.toISOString(),
        endTime: new Date(date.getTime() + duration * 60000).toISOString(),
        duration,
        activityType,
        metadata: activityType === 'practice' ? {
          questionsCount: Math.floor(Math.random() * 10) + 5,
          correctCount: Math.floor(Math.random() * 8) + 4,
        } : undefined,
      });
    }
  }

  return sessions;
}

// 测试函数
async function testReportGeneration() {
  console.log('🧪 开始测试学习报告生成系统...\n');

  try {
    // 生成模拟数据
    console.log('📊 生成模拟学习数据...');
    const sessions = generateMockSessions(30);
    console.log(`✓ 生成了 ${sessions.length} 个学习会话\n`);

    // 测试会话统计
    console.log('📈 测试会话统计计算...');
    const stats = calculateSessionStats(sessions);
    console.log('✓ 会话统计:');
    console.log(`  - 总会话数: ${stats.totalSessions}`);
    console.log(`  - 总时长: ${stats.totalDuration} 分钟`);
    console.log(`  - 平均时长: ${stats.avgSessionDuration} 分钟\n`);

    // 测试周报生成
    console.log('📅 测试周报生成...');
    const weekSessions = sessions.slice(0, 30); // 最近一周
    const weeklyReport = generateWeeklyReport(weekSessions, mockUserStats);
    console.log('✓ 周报生成成功:');
    console.log(`  - 周期: ${weeklyReport.period.start} 至 ${weeklyReport.period.end}`);
    console.log(`  - 总学习时长: ${weeklyReport.summary.totalStudyTime} 分钟`);
    console.log(`  - 成就数: ${weeklyReport.achievements.length}`);
    console.log(`  - 建议数: ${weeklyReport.suggestions.length}\n`);

    // 测试月报生成
    console.log('📆 测试月报生成...');
    const monthlyReport = generateMonthlyReport(sessions, mockUserStats);
    console.log('✓ 月报生成成功:');
    console.log(`  - 月份: ${monthlyReport.period.month}`);
    console.log(`  - 总学习时长: ${monthlyReport.summary.totalStudyTime} 分钟`);
    console.log(`  - 知识点掌握: ${monthlyReport.summary.knowledgePointsMastered}`);
    console.log(`  - 里程碑数: ${monthlyReport.milestones.length}\n`);

    // 测试 AI 洞察生成
    console.log('🤖 测试 AI 洞察生成...');
    const insights = generateLearningInsights(sessions, mockUserStats);
    console.log('✓ AI 洞察生成成功:');
    console.log(`  - 学习一致性: ${insights.studyPattern.consistency}%`);
    console.log(`  - 优势数: ${insights.strengths.length}`);
    console.log(`  - 薄弱点数: ${insights.weaknesses.length}`);
    console.log(`  - 建议数: ${insights.recommendations.length}\n`);

    console.log('✅ 所有测试通过！学习报告生成系统工作正常。\n');

    // 输出示例数据
    console.log('📋 示例周报数据:');
    console.log(JSON.stringify(weeklyReport, null, 2).substring(0, 500) + '...\n');

  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
testReportGeneration().catch(console.error);