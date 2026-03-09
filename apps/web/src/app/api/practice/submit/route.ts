import { NextRequest, NextResponse } from "next/server";
import { submitAnswerSchema } from "@/lib/server/schema";

/**
 * POST /api/practice/submit
 * 提交答案并记录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = submitAnswerSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "请使用客户端 IndexedDB 提交答案",
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
