import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { content, title } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // 使用 LangChain 生成摘要
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.5,
      configuration: {
        baseURL: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
      },
    });

    const prompt = `请为以下文档生成一个简洁的摘要（200字以内）：

文档标题：${title}
文档内容：
${content.substring(0, 3000)}

摘要要求：
1. 概括文档的核心内容和主要观点
2. 使用简洁清晰的语言
3. 突出重点信息
4. 不超过200字

只返回摘要内容，不要其他说明。`;

    const response = await model.invoke(prompt);
    const summary = response.content as string;

    return NextResponse.json({ summary: summary.trim() });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}