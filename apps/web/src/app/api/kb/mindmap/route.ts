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

    // 使用 LangChain 生成思维导图
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      configuration: {
        baseURL: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
      },
    });

    const prompt = `请分析以下文档内容，生成一个思维导图的节点和边数据。

文档标题：${title}
文档内容：
${content.substring(0, 2000)}

请以 JSON 格式返回，包含 nodes 和 edges 两个数组：
- nodes: [{ id: string, label: string, level: number }]
- edges: [{ source: string, target: string }]

其中 level 0 是中心节点，level 1 是主要分支，level 2 是次要分支。
只返回 JSON，不要其他说明。`;

    const response = await model.invoke(prompt);
    const content_text = response.content as string;

    // 解析 JSON
    const jsonMatch = content_text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse mind map data");
    }

    const mindMapData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(mindMapData);
  } catch (error) {
    console.error("Error generating mind map:", error);
    return NextResponse.json(
      { error: "Failed to generate mind map" },
      { status: 500 }
    );
  }
}