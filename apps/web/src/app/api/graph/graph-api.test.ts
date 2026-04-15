import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { GET as getGraphView } from "./view/route";
import { GET as getGraphNode } from "./node/[nodeId]/route";
import {
  cleanupSandbox,
  createSandbox,
  writeMarkdown
} from "@/tests/test-helpers";

type Sandbox = Awaited<ReturnType<typeof createSandbox>>;

describe("graph api", () => {
  let sandbox: Sandbox;

  beforeAll(async () => {
    sandbox = await createSandbox("graph");
    process.env.EDUNEXUS_VAULT_DIR = sandbox.vaultDir;
    process.env.EDUNEXUS_DATA_DIR = sandbox.dataDir;

    await writeMarkdown(
      sandbox.vaultDir,
      "notes/note_graph_react.md",
      [
        "---",
        "id: note_graph_react",
        "title: React 基础",
        "type: note",
        "domain: frontend",
        "tags: [React, 基础]",
        "links: [note_graph_hooks]",
        "source_refs: [course]",
        "owner: test",
        "---",
        "",
        "React 基础包含组件、状态和副作用。"
      ].join("\n")
    );

    await writeMarkdown(
      sandbox.vaultDir,
      "notes/note_graph_hooks.md",
      [
        "---",
        "id: note_graph_hooks",
        "title: Hooks",
        "type: note",
        "domain: frontend",
        "tags: [React, Hooks]",
        "links: []",
        "source_refs: [course]",
        "owner: test",
        "---",
        "",
        "Hooks 包括 useState 与 useEffect。"
      ].join("\n")
    );
  });

  afterAll(async () => {
    delete process.env.EDUNEXUS_VAULT_DIR;
    delete process.env.EDUNEXUS_DATA_DIR;
    await cleanupSandbox(sandbox.rootDir);
  });

  it("returns real graph view", async () => {
    const res = await getGraphView(new Request("http://localhost/api/graph/view"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      data: { nodes: Array<{ id: string }>; edges: Array<{ source: string; target: string }> };
    };

    expect(json.data.nodes.some((node) => node.id === "note_graph_react")).toBe(true);
    expect(
      json.data.edges.some(
        (edge) => edge.source === "note_graph_react" && edge.target === "note_graph_hooks"
      )
    ).toBe(true);
  });

  it("returns real node detail with related notes and evidences", async () => {
    const res = await getGraphNode(new Request("http://localhost/api/graph/node/note_graph_react"), {
      params: Promise.resolve({ nodeId: "note_graph_react" })
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      data: {
        node: { id: string };
        relatedNotes: Array<{ id: string }>;
        evidences: Array<{ sourceId: string }>;
      };
    };

    expect(json.data.node.id).toBe("note_graph_react");
    expect(json.data.relatedNotes.some((note) => note.id === "note_graph_react")).toBe(true);
    expect(json.data.evidences.some((evidence) => evidence.sourceId === "note_graph_react")).toBe(true);
  });
});
