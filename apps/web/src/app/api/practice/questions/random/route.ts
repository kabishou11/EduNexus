import { NextRequest, NextResponse } from "next/server";
import { randomQuestionsSchema } from "@/lib/server/schema";

/**
 * POST /api/practice/questions/random
 * 随机抽题
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = randomQuestionsSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "请使用客户端 IndexedDB 随机抽题",
      data: validated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Invalid request",
      },
      { status: 400 }
    );
  }
}
