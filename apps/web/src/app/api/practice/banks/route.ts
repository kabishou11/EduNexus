import { NextRequest, NextResponse } from "next/server";
import { createQuestionBankSchema } from "@/lib/server/schema";

/**
 * GET /api/practice/banks
 * 获取所有题库（客户端处理）
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "请使用客户端 IndexedDB 获取题库列表",
  });
}

/**
 * POST /api/practice/banks
 * 创建题库（客户端处理）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createQuestionBankSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "请使用客户端 IndexedDB 创建题库",
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
