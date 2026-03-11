import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, documentContent, documentTitle } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // 使用 LangChain 进行问答
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      configuration: {
        baseURL: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
      },
    });

    const systemPrompt = `你是一个知识库助手，专门帮助用户理解和分析文档内容。

当前文档：
标题：${documentTitle}
内容：
${documentContent.substring(0, 3000)}

请基于文档内容回答用户的问题。如果问题超出文档范围，请礼貌地说明。`;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await model.invoke(chatMessages);
    const answer = response.content as string;

    return NextResponse.json({ response: answer });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}