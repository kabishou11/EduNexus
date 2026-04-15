import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST as kbQa } from "./route";
import {
  cleanupSandbox,
  createSandbox,
  writeMarkdown
} from "@/tests/test-helpers";

type Sandbox = Awaited<ReturnType<typeof createSandbox>>;

describe("kb qa api", () => {
  let sandbox: Sandbox;

  beforeAll(async () => {
    sandbox = await createSandbox("kb-qa");
    process.env.EDUNEXUS_VAULT_DIR = sandbox.vaultDir;
    process.env.EDUNEXUS_DATA_DIR = sandbox.dataDir;
    delete process.env.MODELSCOPE_API_KEY;

    await writeMarkdown(
      sandbox.vaultDir,
      "notes/note_qa_series.md",
      [
        "---",
        "id: note_qa_series",
        "title: 数列条件识别",
        "type: note",
        "domain: math",
        "tags: [数列, 条件识别]",
        "links: []",
        "source_refs: [course]",
        "owner: test",
        "---",
        "",
        "做数列题时，先识别首项、公差和递推条件，再决定是否套公式。"
      ].join("\n")
    );
  });

  afterAll(async () => {
    delete process.env.EDUNEXUS_VAULT_DIR;
    delete process.env.EDUNEXUS_DATA_DIR;
    await cleanupSandbox(sandbox.rootDir);
  });

  it("answers questions from searched vault documents", async () => {
    const res = await kbQa(
      new Request("http://localhost/api/kb/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "数列题应该先判断什么？",
          history: []
        })
      })
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      data: {
        answer: string;
        sources: Array<{ id: string }>;
        candidates: Array<{ docId: string }>;
      };
    };

    expect(json.data.answer.length).toBeGreaterThan(0);
    expect(json.data.sources.some((source) => source.id === "note_qa_series")).toBe(true);
    expect(json.data.candidates.some((candidate) => candidate.docId === "note_qa_series")).toBe(true);
  });

  it("returns 404 when no vault document matches", async () => {
    const res = await kbQa(
      new Request("http://localhost/api/kb/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "量子隧穿在这个知识库里怎么解释？"
        })
      })
    );

    expect(res.status).toBe(404);
    const json = (await res.json()) as {
      success: false;
      error: { code: string };
    };
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("KB_CONTEXT_NOT_FOUND");
  });
});
