# EduNexus 一期任务板（可直接转 GitHub Projects）

> 基线：`edu-nexus-prd-requirements-v1.md` + `edu-nexus-phase1-delivery-plan.md`  
> 目标周期：4 周（Week 1 ~ Week 4）  
> 任务状态：`todo | in_progress | review | done | blocked`

---

## 1. 使用说明（建议）

- Issue 标题格式：`[Sprint][模块][ID] 简短描述`
- 标签建议：`phase1`、`backend`、`frontend`、`workflow`、`kb-lite`、`infra`、`priority/p0`、`priority/p1`
- 字段建议：`Owner`、`Priority`、`Estimate`、`DependsOn`、`Acceptance`

---

## 2. Sprint 规划

### Sprint 1（Week 1）：骨架与契约

| ID | 类型 | 优先级 | 估时 | 任务 | 依赖 | 验收 |
|---|---|---|---|---|---|---|
| S1-01 | Infra | P0 | 1d | 初始化 monorepo 目录（apps/packages/openapi/vault） | - | 目录结构与 README 完成 |
| S1-02 | FE | P0 | 1.5d | 建立 `/workspace` 三栏布局骨架（Galaxy 主题） | S1-01 | 可访问，布局稳定 |
| S1-03 | BE | P0 | 1d | 定义 zod schema：session/citation/path/graph | S1-01 | schema 编译通过 |
| S1-04 | Workflow | P0 | 1d | ModelScope 客户端封装（服务端） | S1-03 | 可完成最小调用 |
| S1-05 | Infra | P0 | 1d | CI：lint/typecheck/test/build | S1-01 | PR 自动执行并全绿 |
| S1-06 | KB | P1 | 1d | 初始化 `vault` 与模板（note/skill） | S1-01 | 模板可复制使用 |

### Sprint 2（Week 2）：学习引导主链路

| ID | 类型 | 优先级 | 估时 | 任务 | 依赖 | 验收 |
|---|---|---|---|---|---|---|
| S2-01 | API | P0 | 1d | `POST /api/workspace/session` | S1-03 | 会话创建成功 |
| S2-02 | API | P0 | 1.5d | `POST /api/workspace/socratic/next` | S2-01,S1-04 | 返回下一层提示 |
| S2-03 | API | P0 | 1d | `POST /api/workspace/socratic/unlock-final` | S2-02 | 门控规则生效 |
| S2-04 | API | P0 | 1d | `GET /api/workspace/session/{id}/stream`（SSE） | S2-01,S2-02 | 首 token < 2s |
| S2-05 | FE | P0 | 1.5d | 工作区对接 Socratic 交互与流式输出 | S2-02,S2-04 | 用户可完成一轮引导 |
| S2-06 | KB | P0 | 1d | `POST /api/workspace/note/save` + 写入 markdown | S2-01 | 会话可沉淀成笔记 |

### Sprint 3（Week 3）：图谱与路径闭环

| ID | 类型 | 优先级 | 估时 | 任务 | 依赖 | 验收 |
|---|---|---|---|---|---|---|
| S3-01 | API | P0 | 1d | `GET /api/graph/view` | S1-03 | 返回图谱视图数据 |
| S3-02 | API | P0 | 1d | `GET /api/graph/node/{nodeId}` | S3-01 | 节点详情可查 |
| S3-03 | Workflow | P0 | 1d | 会话完成后更新掌握度（规则版） | S2-02,S3-01 | 图谱状态有变化 |
| S3-04 | API | P0 | 1d | `POST /api/path/generate` | S3-03 | 生成 7 日计划 |
| S3-05 | API | P0 | 0.5d | `POST /api/path/replan` | S3-04 | 可重排计划 |
| S3-06 | FE | P0 | 1.5d | `/graph` + `/path` 页面接入 API | S3-01~S3-05 | 页面闭环可演示 |

### Sprint 4（Week 4）：看板与发布准备

| ID | 类型 | 优先级 | 估时 | 任务 | 依赖 | 验收 |
|---|---|---|---|---|---|---|
| S4-01 | FE | P1 | 1d | `/dashboard` 轻量版（核心 KPI） | S3-06 | 看板可筛选/展示 |
| S4-02 | Data | P0 | 1d | 埋点：独立完成率/提示依赖率/citation 覆盖率 | S2-05 | 数据可统计 |
| S4-03 | BE | P0 | 1d | 统一错误码与 traceId 链路 | S2-01~S3-05 | 错误返回统一 |
| S4-04 | Infra | P0 | 1d | Vercel Preview/Prod 配置 | S1-05 | PR 可预览，main 可部署 |
| S4-05 | QA | P0 | 1d | 一期回归测试 + Demo 脚本 | S4-01~S4-04 | 10 分钟演示稳定 |

---

## 3. Phase 1 核心验收门槛（必须）

- `Gate-01`：`/workspace` Socratic 分层链路成功率 >= 95%
- `Gate-02`：知识型回答 citation 覆盖率 >= 80%
- `Gate-03`：学习完成后图谱与路径均可观察到变化
- `Gate-04`：CI 全绿 + Vercel 可部署
- `Gate-05`：本地 vault 沉淀可用（至少 20 条结构化笔记样本）

---

## 4. GitHub Issue 模板（复制即用）

```md
Title: [Sprint2][API][S2-02] 实现 /api/workspace/socratic/next

Context:
- 对应 PRD: API-WS-002
- 对应页面: /workspace

Scope:
- [ ] 实现请求校验
- [ ] 调用 LangGraph 节点
- [ ] 返回 nextLevel/guidance/citations
- [ ] 写入 traceId

Acceptance:
- [ ] 单测通过
- [ ] 接口返回符合 openapi
- [ ] 本地联调截图或 curl 回执

DependsOn:
- S2-01

Labels:
- phase1
- backend
- workflow
- priority/p0
```

---

## 5. 推荐先开工顺序（今天就能做）

1. 开 `S1-01`（目录与骨架）
2. 并行开 `S1-02`（前端骨架）与 `S1-03`（schema）
3. `S1-04` 完成后直接接 `S2-02`（最关键接口）
4. 第一个可见成果优先 `/workspace` 主链路跑通

