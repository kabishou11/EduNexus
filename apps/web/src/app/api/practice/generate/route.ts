import { NextRequest, NextResponse } from "next/server";
import { generateQuestionsSchema } from "@/lib/server/schema";
import { getAIService } from "@/lib/ai-service";

/**
 * POST /api/practice/generate
 * 基于文档内容生成题目
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = generateQuestionsSchema.parse(body);

    const aiService = getAIService();

    // 构建生成题目的提示词
    const prompt = `你是一个专业的教育题目生成专家。请基于以下文档内容生成 ${validated.count} 道${getDifficultyText(validated.difficulty)}的${getTypeText(validated.type)}题目。

文档内容：
${validated.documentContent}

要求：
1. 题目要紧扣文档内容，考查关键知识点
2. 难度适中，符合 ${getDifficultyText(validated.difficulty)} 水平
3. 题目表述清晰，避免歧义
4. ${getTypeRequirements(validated.type)}

请以 JSON 格式返回题目数组，每个题目包含以下字段：
- title: 题目标题
- content: 题目内容
- difficulty: 难度 (${validated.difficulty})
- type: 题目类型 (${validated.type || "multiple_choice"})
- points: 分值 (1-100)
- explanation: 答案解析
- hints: 提示数组（可选）
${getTypeSpecificFields(validated.type)}

返回格式示例：
\`\`\`json
{
  "questions": [
    {
      "title": "题目标题",
      "content": "题目内容",
      "difficulty": "${validated.difficulty}",
      "type": "${validated.type || "multiple_choice"}",
      "points": 10,
      "explanation": "答案解析",
      "hints": ["提示1", "提示2"],
      ${getTypeExampleFields(validated.type)}
    }
  ]
}
\`\`\``;

    const response = await aiService.chat([
      {
        role: "user",
        content: prompt,
      },
    ]);

    // 解析 AI 返回的 JSON
    let generatedQuestions;
    try {
      // 尝试提取 JSON 代码块
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        generatedQuestions = JSON.parse(jsonMatch[1]);
      } else {
        generatedQuestions = JSON.parse(response);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", response);
      throw new Error("AI 返回的格式无效，请重试");
    }

    return NextResponse.json({
      success: true,
      questions: generatedQuestions.questions || [],
      bankId: validated.bankId,
    });
  } catch (error: any) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "生成题目失败",
      },
      { status: 500 }
    );
  }
}

function getDifficultyText(difficulty: string): string {
  const map: Record<string, string> = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };
  return map[difficulty] || "中等";
}

function getTypeText(type?: string): string {
  const map: Record<string, string> = {
    multiple_choice: "选择",
    fill_in_blank: "填空",
    short_answer: "简答",
    coding: "编程",
  };
  return map[type || "multiple_choice"] || "选择";
}

function getTypeRequirements(type?: string): string {
  const map: Record<string, string> = {
    multiple_choice: "提供4个选项，其中1个正确答案",
    fill_in_blank: "标注需要填空的位置，提供标准答案",
    short_answer: "提供参考答案和评分要点",
    coding: "提供测试用例和预期输出",
  };
  return map[type || "multiple_choice"] || "提供4个选项，其中1个正确答案";
}

function getTypeSpecificFields(type?: string): string {
  const map: Record<string, string> = {
    multiple_choice: `- options: 选项数组，每个选项包含 id, text, isCorrect`,
    fill_in_blank: `- blanks: 标准答案数组`,
    short_answer: `- (答案在 explanation 中说明)`,
    coding: `- testCases: 测试用例数组，每个包含 input 和 expectedOutput
- starterCode: 起始代码模板`,
  };
  return map[type || "multiple_choice"] || "";
}

function getTypeExampleFields(type?: string): string {
  const map: Record<string, string> = {
    multiple_choice: `"options": [
        {"id": "A", "text": "选项A", "isCorrect": false},
        {"id": "B", "text": "选项B", "isCorrect": true},
        {"id": "C", "text": "选项C", "isCorrect": false},
        {"id": "D", "text": "选项D", "isCorrect": false}
      ]`,
    fill_in_blank: `"blanks": ["答案1", "答案2"]`,
    short_answer: ``,
    coding: `"testCases": [
        {"input": "输入1", "expectedOutput": "输出1"},
        {"input": "输入2", "expectedOutput": "输出2"}
      ],
      "starterCode": "// 起始代码\\nfunction solution() {\\n  \\n}"`,
  };
  return map[type || "multiple_choice"] || "";
}
