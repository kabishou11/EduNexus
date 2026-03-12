import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { goalTitle, goalDescription, category, type } = await request.json();

    if (!goalTitle) {
      return NextResponse.json(
        { error: '目标标题不能为空' },
        { status: 400 }
      );
    }

    const prompt = `作为一个学习目标规划专家，请帮助用户完善他们的学习目标。

用户的目标信息：
- 标题：${goalTitle}
- 描述：${goalDescription || '无'}
- 分类：${category || '未指定'}
- 类型：${type || '未指定'}

请提供以下建议（以JSON格式返回）：
1. SMART目标分析（Specific, Measurable, Achievable, Relevant, Time-bound）
2. 建议的里程碑（3-5个关键里程碑）
3. 相关知识点推荐
4. 学习资源建议
5. 潜在挑战和应对策略

返回格式：
{
  "smart": {
    "specific": "具体的目标描述",
    "measurable": "可衡量的指标",
    "achievable": "可实现性分析",
    "relevant": "相关性说明",
    "timeBound": "时间规划建议"
  },
  "milestones": [
    {
      "title": "里程碑标题",
      "description": "里程碑描述",
      "estimatedDays": 30
    }
  ],
  "relatedKnowledge": ["知识点1", "知识点2"],
  "resources": ["资源建议1", "资源建议2"],
  "challenges": [
    {
      "challenge": "挑战描述",
      "solution": "应对策略"
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from the response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const suggestions = JSON.parse(jsonMatch[0]);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Goal suggestion error:', error);
    return NextResponse.json(
      { error: '生成建议失败，请稍后重试' },
      { status: 500 }
    );
  }
}
