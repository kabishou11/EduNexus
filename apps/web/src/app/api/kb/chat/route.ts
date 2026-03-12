import { NextRequest, NextResponse } from "next/server";
import { getModelscopeClient } from "@/lib/server/modelscope";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, documentContent, documentTitle } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // 使用 ModelScope 进行问答
    const client = getModelscopeClient();
    const model = process.env.MODELSCOPE_CHAT_MODEL ?? "Qwen/Qwen2.5-72B-Instruct";

    const systemPrompt = `你是一个知识库助手，专门帮助用户理解和分析文档内容。

当前文档：
标题：${documentTitle}
内容：
${documentContent.substring(0, 3000)}

请基于文档内容回答用户的问题。如果问题超出文档范围，请礼貌地说明。`;

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "";

    return NextResponse.json({ response: answer });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get response" },
      { status: 500 }
    );
  }
}
