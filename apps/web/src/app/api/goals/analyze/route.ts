import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { goal, habits } = await request.json();

    if (!goal) {
      return NextResponse.json(
        { error: '目标信息不能为空' },
        { status: 400 }
      );
    }

    const prompt = `作为一个学习进度分析专家，请分析用户的目标进展情况。

目标信息：
- 标题：${goal.title}
- 描述：${goal.description}
- 当前进度：${goal.progress}%
- 开始日期：${goal.startDate}
- 目标日期：${goal.endDate}
- 已完成里程碑：${goal.milestones.filter((m: any) => m.completed).length} / ${goal.milestones.length}

${habits && habits.length > 0 ? `相关习惯：
${habits.map((h: any) => `- ${h.name}: 连续${h.streak}天，完成率${h.completionRate}%`).join('\n')}` : ''}

请提供以下分析（以JSON格式返回）：
1. 进度评估（是否按计划进行）
2. 优势分析（做得好的地方）
3. 改进建议（需要改进的地方）
4. 下一步行动建议（具体可执行的步骤）
5. 激励语（鼓励的话）

返回格式：
{
  "progressAssessment": {
    "status": "on-track|ahead|behind",
    "summary": "进度评估总结"
  },
  "strengths": ["优势1", "优势2"],
  "improvements": ["改进建议1", "改进建议2"],
  "nextActions": [
    {
      "action": "行动描述",
      "priority": "high|medium|low",
      "estimatedTime": "预计时间"
    }
  ],
  "motivation": "激励语"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
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

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Goal analysis error:', error);
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}
