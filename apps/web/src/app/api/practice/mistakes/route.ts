import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/practice/mistakes?bankId=xxx&onlyUnmastered=true
 * 获取错题本
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bankId = searchParams.get("bankId");
  const onlyUnmastered = searchParams.get("onlyUnmastered") !== "false";

  return NextResponse.json({
    success: true,
    message: "请使用客户端 IndexedDB 获取错题本",
    bankId,
    onlyUnmastered,
  });
}
