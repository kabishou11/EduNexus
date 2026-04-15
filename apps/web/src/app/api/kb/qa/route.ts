/**
 * 知识库智能问答 API
 * POST /api/kb/qa
 */

import OpenAI from "openai";
import { getModelscopeClient } from "@/lib/server/modelscope";
import { buildWorkspaceGraphContext } from "@/lib/server/workspace-graph-context";
import { getVaultDocById, searchVault } from "@/lib/server/kb-lite";
import { fail, ok } from "@/lib/server/response";
import { kbQaSchema } from "@/lib/server/schema";

function buildFallbackAnswer(question: string, docs: Array<{ id: string; title: string; content: string }>) {
  const primary = docs[0];
  const evidence = docs
    .slice(0, 2)
    .map((doc) => `- ${doc.title}（${doc.id}）：${doc.content.slice(0, 120)}`)
    .join("\n");

  return [
    `基于当前知识库检索结果，我先给你一个可验证的回答：`,
    `问题：${question}`,
    primary
      ? `优先参考《${primary.title}》中的内容，先从它提到的关键条件入手，再决定下一步分析。`
      : "当前没有足够证据支持更具体的结论。",
    "",
    "已命中的知识片段：",
    evidence,
    "",
    "如果你愿意，我可以继续基于这些文档帮你拆成步骤。"
  ].join("\n");
}

function normalizeQuestionForSearch(question: string) {
  return question
    .replace(/[？?！!。，“”"'：:、,；;（）()]/g, " ")
    .replace(/(请问|请|一下|一下子|应该|怎么|怎样|如何|什么|哪些|哪个|为什么|吗|呢|呀|吧|先|再|这个|那个|有关|关于)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchQueries(question: string) {
  const normalized = normalizeQuestionForSearch(question);
  const queries = new Set<string>();
  const seeds = [question.trim(), normalized].filter(Boolean);

  for (const seed of seeds) {
    queries.add(seed);

    const compact = seed.replace(/\s+/g, "");
    if (compact.length >= 2) {
      queries.add(compact);
    }

    const parts = seed
      .split(/\s+/)
      .map((part) => part.trim())
      .filter((part) => part.length >= 2);

    for (const part of parts) {
      queries.add(part);
      if (part.endsWith("题") && part.length >= 3) {
        queries.add(part.slice(0, -1));
      }
    }
  }

  return Array.from(queries).slice(0, 8);
}

async function searchVaultForQuestion(question: string) {
  const merged = new Map<
    string,
    { docId: string; score: number; snippet: string; reason: string[] }
  >();

  const queries = buildSearchQueries(question);
  for (const query of queries) {
    const result = await searchVault(query, {});
    for (const candidate of result.candidates) {
      const previous = merged.get(candidate.docId);
      const boostedScore = candidate.score + (query === question.trim() ? 0.2 : 0);
      if (!previous || boostedScore > previous.score) {
        merged.set(candidate.docId, {
          docId: candidate.docId,
          score: boostedScore,
          snippet: candidate.snippet,
          reason: Array.from(new Set([...(previous?.reason ?? []), ...candidate.reason, `query:${query}`]))
        });
      }
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parsed = kbQaSchema.safeParse(json);

    if (!parsed.success) {
      return fail({
        code: "INVALID_REQUEST",
        message: "请求参数不合法。",
        details: parsed.error.flatten()
      });
    }

    const { question, history, config, taskContext } = parsed.data;

    let client: OpenAI | null = null;
    try {
      client = getModelscopeClient();
    } catch {
      if (config?.apiKey && config?.apiEndpoint) {
        client = new OpenAI({
          apiKey: config.apiKey,
          baseURL: config.apiEndpoint,
        });
      }
    }
    const model = config?.modelName || process.env.MODELSCOPE_CHAT_MODEL || "Qwen/Qwen3.5-122B-A10B";

    const topCandidates = await searchVaultForQuestion(question);
    const docs = await Promise.all(topCandidates.map((candidate) => getVaultDocById(candidate.docId)));
    const matchedDocs = docs.filter((doc): doc is NonNullable<typeof doc> => Boolean(doc));

    if (matchedDocs.length === 0) {
      return fail(
        {
          code: "KB_CONTEXT_NOT_FOUND",
          message: "当前知识库中没有匹配该问题的真实文档，请先补充笔记后再提问。"
        },
        404
      );
    }

    const context = matchedDocs
      .map((doc, index) => {
        const candidate = topCandidates.find((item) => item.docId === doc.id);
        return [
          `【文档 ${index + 1}】${doc.title}`,
          `- id: ${doc.id}`,
          `- tags: ${doc.tags.join(", ") || "无"}`,
          `- reason: ${candidate?.reason.join(", ") || "match"}`,
          `- snippet: ${candidate?.snippet || doc.content.slice(0, 160)}`,
          doc.content.slice(0, 800)
        ].join("\n");
      })
      .join("\n\n");

    const graphContext = await buildWorkspaceGraphContext({
      taskId: typeof taskContext?.taskId === "string" ? taskContext.taskId : undefined,
      taskTitle: typeof taskContext?.taskTitle === "string" ? taskContext.taskTitle : undefined,
    });

    const taskContextBlock = taskContext?.taskTitle
      ? `\n\n当前学习任务：\n- 路径：${taskContext.pathTitle || taskContext.pathId || "未命名路径"}\n- 任务：${taskContext.taskTitle}\n- 进度：${Math.round(taskContext.taskProgress ?? 0)}%\n请回答时优先贴合该任务。`
      : "";

    const graphContextBlock = graphContext.taskNode
      ? `\n\n当前任务知识图谱上下文：\n- 任务节点：${graphContext.taskNode.label}（id=${graphContext.taskNode.id}${graphContext.taskNode.domain ? `，domain=${graphContext.taskNode.domain}` : ""}${typeof graphContext.taskNode.mastery === "number" ? `，mastery=${Math.round(graphContext.taskNode.mastery * 100)}%` : ""}${typeof graphContext.taskNode.risk === "number" ? `，risk=${Math.round(graphContext.taskNode.risk * 100)}%` : ""}）${graphContext.relatedNodes.length > 0 ? `\n- 关联节点：\n${graphContext.relatedNodes
          .slice(0, 12)
          .map((node, index) => `${index + 1}. ${node.label}（id=${node.id}${node.domain ? `，domain=${node.domain}` : ""}${typeof node.mastery === "number" ? `，mastery=${Math.round(node.mastery * 100)}%` : ""}${typeof node.risk === "number" ? `，risk=${Math.round(node.risk * 100)}%` : ""}）`)
          .join("\n")}` : "\n- 关联节点：无"}${graphContext.relatedEdges.length > 0 ? `\n- 关联边：\n${graphContext.relatedEdges
          .slice(0, 20)
          .map((edge) => `${edge.source} -> ${edge.target}${typeof edge.weight === "number" ? `（weight=${edge.weight}）` : ""}`)
          .join("\n")}` : "\n- 关联边：无"}\n请结合任务节点在知识图谱中的关系回答。`
      : "";

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `你是一个基于真实知识库的智能问答助手。请严格根据提供的知识文档回答用户的问题。

知识库检索结果：
${context}${taskContextBlock}${graphContextBlock}

要求：
- 优先使用检索到的真实知识文档回答
- 如果检索结果不足以支持结论，要明确说明“知识库中暂无足够证据”
- 尽量引用文档标题、id 或具体片段
- 保持回答简洁准确，不要编造知识库中不存在的事实`
      },
    ];

    if (history && Array.isArray(history)) {
      history.slice(-4).forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    messages.push({
      role: "user",
      content: question,
    });

    const answer = client
      ? (
          await client.chat.completions.create({
            model,
            messages,
            temperature: 0.3,
            max_tokens: 1500,
          })
        ).choices[0]?.message?.content || "抱歉，我无法回答这个问题。"
      : buildFallbackAnswer(
          question,
          matchedDocs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
          }))
        );

    return ok({
      answer,
      sources: matchedDocs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        path: doc.path,
      })),
      candidates: topCandidates.map((candidate) => ({
        docId: candidate.docId,
        score: candidate.score,
        reason: candidate.reason,
      })),
    });
  } catch (error) {
    console.error("智能问答失败:", error);
    return fail(
      {
        code: "KB_QA_FAILED",
        message: error instanceof Error ? error.message : "问答失败",
      },
      500
    );
  }
}
