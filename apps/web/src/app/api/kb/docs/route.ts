import { fail, ok } from "@/lib/server/response";
import { createKbDocumentSchema } from "@/lib/server/schema";
import { createVaultDoc, listVaultDocs } from "@/lib/server/kb-lite";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get("vaultId")?.trim() || undefined;
    const type = searchParams.get("type")?.trim() || undefined;
    const domain = searchParams.get("domain")?.trim() || undefined;
    const tag = searchParams.get("tag")?.trim() || undefined;

    const docs = await listVaultDocs({ vaultId, type, domain, tag });

    return ok({ docs });
  } catch (error) {
    return fail(
      {
        code: "KB_DOCS_LIST_FAILED",
        message: "获取知识文档列表失败。",
        details: error instanceof Error ? error.message : error,
      },
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parsed = createKbDocumentSchema.safeParse(json);
    if (!parsed.success) {
      return fail({
        code: "INVALID_REQUEST",
        message: "请求参数不合法。",
        details: parsed.error.flatten(),
      });
    }

    const doc = await createVaultDoc({
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
      links: parsed.data.links,
      type: parsed.data.type,
      domain: parsed.data.domain,
      vaultId: parsed.data.vaultId,
      owner: "kb-ui",
    });

    return ok({ doc });
  } catch (error) {
    return fail(
      {
        code: "KB_DOC_CREATE_FAILED",
        message: "创建知识文档失败。",
        details: error instanceof Error ? error.message : error,
      },
      500
    );
  }
}
