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

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "你是一个专业的文档摘要助手，擅长提取核心要点。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: config?.temperature || 0.5,
    });

    const summary = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Error generating summary:", error);

    // 提取更详细的错误信息
    let errorMessage = "生成摘要失败";
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
