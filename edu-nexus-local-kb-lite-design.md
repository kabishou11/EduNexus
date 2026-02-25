# EduNexus 本地轻量化知识库方案（Obsidian + ClaudeCode + Skills 思路）

> 目标：打造“可沉淀、可检索、可复用”的本地知识底座，避免重型 RAG 基础设施。

---

## 1. 设计原则

1. **Local-first**：知识资产优先存本地文件系统（可 Git 版本化）。
2. **Markdown-first**：统一用 Markdown + Frontmatter 承载内容与元数据。
3. **Link-first**：双链和反链优先于向量检索，先利用“已知结构关系”。
4. **Lightweight Retrieval**：优先规则检索 + FTS，向量检索仅作可选增强。
5. **Skill化沉淀**：高价值流程抽象为 `skills`（模板 + 操作步骤 + 示例）。

---

## 2. 为什么“不做繁琐 RAG”也能有效

你的场景里，知识来源很大一部分是结构化且可控的：
- 学习笔记、课程讲义、教案、复盘、路径计划；
- 这些内容天然带标签、链接、上下文关系；
- 真正需要的是“可信引用 + 快速复用”，而不是全网开放问答。

所以一期可先采用：
- 文档结构化（frontmatter）；
- 文件图关系（双链/反链）；
- SQLite FTS5（或同级全文检索）；
- 规则召回 + 少量候选给模型；

这套组合比重型 RAG 成本低、可控性高、维护简单。

---

## 3. 本地知识库目录规范（建议）

```txt
vault/
  notes/                     # 学习笔记（个人/课程）
  sources/                   # 来源文档（教材、讲义、政策）
  playbooks/                 # 可复用方法论（如错因分析流程）
  skills/                    # 类似 skills 的能力单元
  daily/                     # 每日学习与复盘
  graph/                     # 图谱导出快照（json）
  index/
    fts.db                   # 本地全文索引（SQLite FTS5）
    backlinks.json           # 反向链接索引
    tags.json                # 标签到文档映射
```

---

## 4. 文档协议（Frontmatter 约定）

每篇 Markdown 顶部统一：

```yaml
---
id: note_math_seq_001
title: 等差数列求和复盘
type: note            # note/source/playbook/skill/daily
domain: math
tags: [数列, 复盘, 高考]
links: [note_math_seq_000, source_textbook_12]
source_refs: [source_textbook_12#chunk_31]
difficulty: 2
updated_at: 2026-02-25
owner: student_a
---
```

正文采用固定区块模板：
- `## Context`（场景与目标）
- `## Reasoning`（思考路径）
- `## Evidence`（引用来源）
- `## Outcome`（结论/结果）
- `## Next`（后续行动）

---

## 5. 轻量检索策略（不依赖复杂 RAG）

### 5.1 检索优先级（从强到弱）
1. **显式链接召回**：基于 `links/source_refs` 直接取关联文档。
2. **标签与域过滤**：按 `domain/tags/type` 缩小候选。
3. **全文检索（FTS5）**：对标题+正文+标签做 BM25 排序。
4. **时间与热度加权**：最近更新/高复用文档优先。
5. **可选向量补充**：仅在候选不足时追加小模型 embedding（可后置）。

### 5.2 返回结构（给 LLM 的上下文包）

```json
{
  "query": "等差数列求和复习策略",
  "candidates": [
    {
      "doc_id": "note_math_seq_001",
      "score": 0.92,
      "reason": ["tag_match", "backlink", "fts_top3"],
      "snippet": "..."
    }
  ]
}
```

---

## 6. 类 Skills 机制（沉淀可复用能力）

借鉴 ClaudeCode skills 思路，每个 skill 是一个可执行知识单元。

目录示例：

```txt
vault/skills/
  socratic-hinting/
    SKILL.md
    templates/
    examples/
  mistake-analysis/
    SKILL.md
    checklists/
```

`SKILL.md` 建议字段：
- 适用场景；
- 输入要求；
- 执行步骤；
- 输出格式；
- 常见失败模式与纠偏。

作用：
- 让“经验”从一次对话变成可复用流程；
- 便于后续 Agent 选择 skill 作为策略模板；
- 让团队共用统一方法论，而不是口头传承。

---

## 7. 与平台功能对接方式

### 7.1 Workspace 对接
- 会话结束后自动生成/更新 `vault/notes/*.md`。
- 把关键回答 citation 写入 `source_refs`。
- 用户可一键“沉淀为 playbook/skill 草稿”。

### 7.2 Graph 对接
- 从 frontmatter 的 `links/tags/domain` 构造轻量关系图。
- 定时导出 `vault/graph/*.json` 供前端渲染。

### 7.3 Path 对接
- 从 daily + note 的“未完成 Next”生成待办队列；
- 结合掌握度权重生成 7 日计划建议。

---

## 8. 最小实现建议（一期可落地）

### 8.1 技术组合
- 存储：本地文件系统 + Git。
- 索引：SQLite FTS5 + JSON 索引文件。
- API：Next.js Route Handlers。
- 解析：`gray-matter`（frontmatter）+ `remark`。

### 8.2 关键接口（kb-lite）
- `POST /api/kb/note/upsert`
- `GET /api/kb/search?q=...`
- `GET /api/kb/doc/{id}`
- `POST /api/kb/skill/create-draft`
- `POST /api/kb/index/rebuild`

---

## 9. 质量与治理

- 每条 AI 结论尽量带 `source_refs`；
- 每周清理“孤立笔记”（无 links、无 tags）；
- 每月整理高复用笔记为 `playbooks`；
- 每季度从 `playbooks` 提炼正式 `skills`。

---

## 10. 与重型 RAG 的关系（演进路径）

你现在不需要复杂 RAG，这个判断是对的。建议分层演进：

1. **阶段 A（现在）**：Local KB + FTS + 规则召回；
2. **阶段 B**：引入小规模向量补充（只对关键库）；
3. **阶段 C**：当文档规模、噪声和跨域查询显著上升，再升级完整 RAG。

这样可以最大化“沉淀效率 / 交付速度 / 成本可控性”。

---

## 11. 一期落地任务（本地知识库部分）

1. 建立 `vault` 目录和文档模板。
2. 实现 frontmatter 校验器（缺关键字段则拒绝入库）。
3. 实现 FTS 索引构建与增量更新。
4. 实现 `kb/search` 与 `kb/doc` API。
5. 在 `/workspace` 接入“会话沉淀到笔记”按钮。
6. 实现“从笔记生成 skill 草稿”能力。

