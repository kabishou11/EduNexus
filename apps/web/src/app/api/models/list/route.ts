import { NextResponse } from "next/server";
import { getModelscopeClient } from "@/lib/server/modelscope";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 获取 ModelScope 可用模型列表
 * GET /api/models/list
 */
export async function GET() {
  try {
    const client = getModelscopeClient();

    // 调用 ModelScope API 获取模型列表
    const response = await fetch("https://api-inference.modelscope.cn/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.MODELSCOPE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`ModelScope API error: ${response.statusText}`);
    }

    const data = await response.json();

    // 过滤出聊天模型并格式化
    const models = data.data
      ?.filter((model: any) => {
        // 只返回支持聊天的模型
        return model.id && (
          model.id.includes("Qwen") ||
          model.id.includes("DeepSeek") ||
          model.id.includes("GLM") ||
          model.id.includes("chat") ||
          model.id.includes("Chat")
        );
      })
      .map((model: any) => ({
        id: model.id,
        name: model.id.split("/").pop() || model.id,
        description: model.description || `${model.id} 模型`,
        provider: "ModelScope",
        created: model.created,
      }))
      .slice(0, 20) || []; // 限制返回前 20 个模型

    return NextResponse.json({
      success: true,
      models,
      total: models.length,
    });
  } catch (error) {
    console.error("Failed to fetch models:", error);

    // 如果 API 调用失败，返回默认模型列表
    const fallbackModels = [
      {
        id: "Qwen/Qwen3-8B",
        name: "Qwen3-8B",
        description: "通义千问 3 代 8B 模型，平衡性能与速度",
        provider: "ModelScope"
      },
      {
        id: "Qwen/Qwen3-4B",
        name: "Qwen3-4B",
        description: "通义千问 3 代 4B 模型，快速响应",
        provider: "ModelScope"
      },
      {
        id: "Qwen/Qwen3-14B",
        name: "Qwen3-14B",
        description: "通义千问 3 代 14B 模型，更强理解能力",
        provider: "ModelScope"
      },
      {
        id: "Qwen/Qwen3-32B",
        name: "Qwen3-32B",
        description: "通义千问 3 代 32B 模型，顶级性能",
        provider: "ModelScope"
      },
      {
        id: "deepseek-ai/DeepSeek-R1",
        name: "DeepSeek-R1",
        description: "DeepSeek 推理模型，强大的逻辑推理能力",
        provider: "ModelScope"
      },
      {
        id: "deepseek-ai/DeepSeek-V3.2",
        name: "DeepSeek-V3.2",
        description: "DeepSeek V3.2 最新版本",
        provider: "ModelScope"
      },
      {
        id: "THUDM/glm-4-9b-chat",
        name: "GLM-4-9B",
        description: "智谱 GLM-4 9B 对话模型",
        provider: "ModelScope"
      }
    ];

    return NextResponse.json({
      success: true,
      models: fallbackModels,
      total: fallbackModels.length,
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
