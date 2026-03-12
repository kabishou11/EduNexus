import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { content, title, config } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // 从请求中获取配置，如果没有则尝试从环境变量获取
    const apiKey = config?.apiKey || process.env.MODELSCOPE_API_KEY;
    const baseURL = config?.apiEndpoint || process.env.MODELSCOPE_BASE_URL || "https://api-inference.modelscope.cn/v1";
    const model = config?.model || process.env.MODELSCOPE_CHAT_MODEL || "Qwen/Qwen2.5-72B-Instruct";

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key 未配置，请在配置中心设置 ModelScope API Key" },
        { status: 400 }
      );
    }

    // 创建 ModelScope 客户端
    const client = new OpenAI({
      apiKey,
      baseURL,
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

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "你是一个专业的思维导图生成助手，擅长分析文档结构并生成清晰的思维导图。只返回JSON格式数据。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: config?.temperature || 0.7,
    });

    const content_text = response.choices[0]?.message?.content || "";

    // 解析 JSON - 支持 markdown 代码块
    const jsonMatch = content_text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                      content_text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      throw new Error("AI 返回的数据格式不正确，无法解析思维导图");
    }

    const mindMapData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    return NextResponse.json(mindMapData);
  } catch (error: any) {
    console.error("Error generating mind map:", error);

    let errorMessage = "生成思维导图失败";
    if (error?.response?.data) {
      errorMessage = JSON.stringify(error.response.data);
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
