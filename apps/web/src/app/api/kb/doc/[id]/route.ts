import {
  deleteVaultDoc,
  getVaultDocById,
  updateVaultDoc,
} from "@/lib/server/kb-lite";
import { fail, ok } from "@/lib/server/response";
import { updateKbDocumentSchema } from "@/lib/server/schema";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const doc = await getVaultDocById(id);
    if (!doc) {
      return fail(
        {
          code: "DOC_NOT_FOUND",
          message: "未找到对应知识文档。"
        },
        404
      );
    }

    return ok({ doc });
  } catch (error) {
    return fail(
      {
        code: "KB_DOC_FAILED",
        message: "读取知识文档失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const json = await request.json().catch(() => ({}));
    const parsed = updateKbDocumentSchema.safeParse(json);
    if (!parsed.success) {
      return fail({
        code: "INVALID_REQUEST",
        message: "请求参数不合法。",
        details: parsed.error.flatten()
      });
    }

    const doc = await updateVaultDoc(id, parsed.data);
    if (!doc) {
      return fail(
        {
          code: "DOC_NOT_FOUND",
          message: "未找到对应知识文档。"
        },
        404
      );
    }

    return ok({ doc });
  } catch (error) {
    return fail(
      {
        code: "KB_DOC_UPDATE_FAILED",
        message: "更新知识文档失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteVaultDoc(id);
    if (!deleted) {
      return fail(
        {
          code: "DOC_NOT_FOUND",
          message: "未找到对应知识文档。"
        },
        404
      );
    }

    return ok({ deleted: true, id });
  } catch (error) {
    return fail(
      {
        code: "KB_DOC_DELETE_FAILED",
        message: "删除知识文档失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}
