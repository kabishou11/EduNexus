import { NextRequest, NextResponse } from "next/server";
import { createQuestionSchema } from "@/lib/server/schema";

/**
 * GET /api/practice/questions?bankId=xxx
 * 获取题库下的所有题目
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bankId = searchParams.get("bankId");

  if (!bankId) {
    return NextResponse.json(
      {
        success: false,
        error: "bankId is required",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "请使用客户端 IndexedDB 获取题目列表",
    bankId,
  });
}

/**
 * POST /api/practice/questions
 * 创建题目
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createQuestionSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "请使用客户端 IndexedDB 创建题目",
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
