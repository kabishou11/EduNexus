import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/practice/statistics?bankId=xxx
 * 获取题库练习统计
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
    message: "请使用客户端 IndexedDB 获取统计数据",
    bankId,
  });
}
