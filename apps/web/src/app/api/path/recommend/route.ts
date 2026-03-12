import { fail, ok } from "@/lib/server/response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * AI 路径推荐 API
 * 根据用户的学习目标、当前水平和兴趣推荐合适的学习路径
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}));
    const { goal, currentLevel, interests, timeAvailable } = json;

    if (!goal) {
      return fail({
        code: "INVALID_REQUEST",
        message: "请提供学习目标",
      });
    }

    // AI 推荐逻辑（简化版，实际应该调用 LLM）
    const recommendations = generateRecommendations({
      goal,
      currentLevel: currentLevel || "beginner",
      interests: interests || [],
      timeAvailable: timeAvailable || 30, // 默认30天
    });

    return ok({
      recommendations,
      message: "成功生成推荐路径",
    });
  } catch (error) {
    return fail(
      {
        code: "RECOMMENDATION_FAILED",
        message: "生成推荐失败",
        details: error instanceof Error ? error.message : error,
      },
      500
    );
  }
}

function generateRecommendations(params: {
  goal: string;
  currentLevel: string;
  interests: string[];
  timeAvailable: number;
}) {
  const { goal, currentLevel, interests, timeAvailable } = params;

  // 基于规则的简单推荐系统
  const recommendations = [];

  // 前端相关推荐
  if (
    goal.toLowerCase().includes("前端") ||
    goal.toLowerCase().includes("frontend") ||
    interests.some((i) => ["前端", "web", "html", "css", "javascript"].includes(i.toLowerCase()))
  ) {
    recommendations.push({
      id: "frontend-basics",
      title: "前端开发入门",
      reason: "适合初学者，涵盖 HTML、CSS 和 JavaScript 基础",
      matchScore: currentLevel === "beginner" ? 95 : 75,
      estimatedDays: Math.ceil(2400 / (timeAvailable * 60)),
    });
  }

  // Python 相关推荐
  if (
    goal.toLowerCase().includes("python") ||
    goal.toLowerCase().includes("数据") ||
    interests.some((i) => ["python", "数据分析", "机器学习"].includes(i.toLowerCase()))
  ) {
    recommendations.push({
      id: "python-basics",
      title: "Python 编程入门",
      reason: "Python 是数据科学和机器学习的首选语言",
      matchScore: 85,
      estimatedDays: Math.ceil(1800 / (timeAvailable * 60)),
    });
  }

  // 算法相关推荐
  if (
    goal.toLowerCase().includes("算法") ||
    goal.toLowerCase().includes("数据结构") ||
    currentLevel === "intermediate" ||
    currentLevel === "advanced"
  ) {
    recommendations.push({
      id: "data-structures",
      title: "数据结构与算法",
      reason: "提升编程能力，为技术面试做准备",
      matchScore: currentLevel === "beginner" ? 60 : 90,
      estimatedDays: Math.ceil(3600 / (timeAvailable * 60)),
    });
  }

  // 如果没有匹配的推荐，提供通用推荐
  if (recommendations.length === 0) {
    recommendations.push({
      id: "frontend-basics",
      title: "前端开发入门",
      reason: "通用推荐：前端开发是最容易入门的方向",
      matchScore: 70,
      estimatedDays: Math.ceil(2400 / (timeAvailable * 60)),
    });
  }

  // 按匹配度排序
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}
