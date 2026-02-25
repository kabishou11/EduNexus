# EduNexus 一期（MVP）执行交付包

> 文档日期：2026-02-25  
> 关联文档：`edu-nexus-prd-requirements-v1.md`、`edu-nexus-ecosystem-web-plan-v2.md`

---

## 1. 一期目标（只做必须闭环）

一期目标是完成一个可真实试用的 Web MVP，不追求功能堆叠，重点验证三件事：

1. 用户可以在 `workspace` 中通过 Socratic 引导“学会”而不是“抄答案”。
2. 每次学习都沉淀到本地知识资产（笔记、证据、知识节点、学习轨迹）。
3. 平台可在 Vercel 上稳定部署，并具备可观测与可演示能力。

---

## 2. 一期范围（In Scope）

### 2.1 页面范围
- `/workspace`（核心）
- `/graph`
- `/path`
- `/dashboard`（轻量版）

### 2.2 能力范围
- 账号与角色：学生、教师、管理员（最小 RBAC）。
- 学习引导：分层提示 + 最终答案解锁门控。
- 来源引用：回答可附 citation（source_id + chunk_ref）。
- 图谱更新：学习后更新节点掌握度与薄弱点。
- 路径生成：按目标生成 7 日计划，可一键重排。
- 本地知识库：Markdown-first 资产沉淀与轻量检索（非复杂 RAG）。

### 2.3 一期不做
- 原生 App。
- 拍照搜题主流程。
- 复杂多模态医疗级功能。
- 重型 RAG 管线（多阶段重排、复杂向量编排）。

---

## 3. 一期架构切片（可直接开发）

```txt
apps/web
  app/(routes)
    dashboard
    workspace
    graph
    path
    api
      workspace/*
      graph/*
      path/*
      sources/*
packages
  ui               # Galaxy UI 二封
  workflows        # LangGraph 工作流
  schemas          # zod 契约
  kb-lite          # 本地轻量知识库逻辑
```

---

## 4. 一期任务分解（按周）

### 4.1 Week 1：骨架与契约
- `W1-01` 初始化 monorepo（Next.js + pnpm workspace）。
- `W1-02` 搭建 Galaxy UI 基础主题与三栏布局。
- `W1-03` 定义 schema（会话、citation、路径、图谱节点）。
- `W1-04` 接入 ModelScope 服务端调用封装。
- `W1-05` 建立 CI（lint/typecheck/test/build）。

验收：
- 本地可启动；
- PR 可触发 CI；
- `/workspace` 空页面可访问。

### 4.2 Week 2：学习引导主链路
- `W2-01` 实现 `POST /api/workspace/session`。
- `W2-02` 实现 `POST /api/workspace/socratic/next`（分层提示）。
- `W2-03` 实现 `POST /api/workspace/socratic/unlock-final`。
- `W2-04` 实现 SSE 流式回复与 traceId。
- `W2-05` 会话片段一键沉淀到 Markdown 笔记。

验收：
- 用户可完成一轮“思路 -> 引导 -> 纠偏 -> 总结”；
- 直接要答案会被门控策略拦截并转引导。

### 4.3 Week 3：图谱与路径闭环
- `W3-01` 实现 `GET /api/graph/view` 与节点详情接口。
- `W3-02` 学习会话结束后更新掌握度（简化算法可先规则版）。
- `W3-03` 实现 `POST /api/path/generate`。
- `W3-04` 实现 `POST /api/path/replan`。
- `W3-05` 页面联动（workspace 完成任务 -> path/graph 更新）。

验收：
- 完成一次学习后，图谱状态与计划同步变化；
- 用户能理解“为什么安排这个任务”。

### 4.4 Week 4：看板与发布准备
- `W4-01` `/dashboard` 轻量版（核心 KPI + 风险提示）。
- `W4-02` 引用覆盖率、提示依赖率、独立完成率埋点。
- `W4-03` 异常处理与错误码统一。
- `W4-04` Vercel Preview/Production 配置。
- `W4-05` 演示脚本与验收报告整理。

验收：
- 完成端到端演示（10 分钟可讲完整价值闭环）；
- main 分支可自动部署到 Vercel。

---

## 5. 一期 DoD（Definition of Done）

满足以下条件才算一期完成：

1. 四个页面均可访问并跑通主流程。
2. Socratic 分层策略可生效，非默认直给答案。
3. 关键知识型回答 citation 覆盖率达到 80% 以上。
4. 学习会话数据可沉淀为本地知识资产（Markdown + 索引）。
5. GitHub CI 全绿，Vercel 可自动部署。

---

## 6. 最小接口清单（一期必须）

- `POST /api/workspace/session`
- `POST /api/workspace/socratic/next`
- `POST /api/workspace/socratic/unlock-final`
- `GET /api/workspace/session/{id}/stream`
- `POST /api/workspace/note/save`
- `GET /api/graph/view`
- `GET /api/graph/node/{nodeId}`
- `POST /api/path/generate`
- `POST /api/path/replan`

---

## 7. 人员与分工建议（3-4 人最小团队）

- FE（1 人）：页面与交互（workspace/graph/path/dashboard）。
- Workflow（1 人）：LangGraph + ModelScope 接口编排。
- Platform（1 人）：API 契约、日志、部署、CI/CD。
- Data/KB（0.5-1 人）：本地知识库结构、索引、检索策略。

---

## 8. 风险与兜底

- 风险：流式调用不稳定导致体验抖动。  
  兜底：支持非流式 fallback，并记录模型错误码。

- 风险：citation 覆盖率不达标。  
  兜底：先保证知识类问答强制检索，开放“无来源回答”提示。

- 风险：图谱更新延迟。  
  兜底：先同步写简化状态，再异步做精细更新。

---

## 9. 一期完成后再上传 GitHub 的操作建议

你提到“先做完一期再上传 `https://github.com/kabishou11/EduNexus`”，建议使用以下顺序：

1. 本地完成一期验收并打 `v0.1.0-mvp` tag。
2. 清理敏感信息（尤其 `MODELSCOPE_API_KEY`）。
3. 补齐 `README`、`.env.example`、演示截图与架构图。
4. 再初始化远程仓库并推送首个可运行版本。
