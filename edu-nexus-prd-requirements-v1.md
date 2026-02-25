# EduNexus Web 平台 PRD + 需求清单（V1）

> 文档版本：v1.0  
> 文档日期：2026-02-25  
> 对齐基线：`edu-nexus-ecosystem-web-plan-v2.md`

---

## 0. 文档目标

本 PRD 将 V2 战略方案拆分为可执行需求，覆盖三层：
- 页面层（Page）：每个页面做什么、如何交互、何时算完成；
- 模块层（Module）：跨页面复用能力如何实现；
- 接口层（API）：前后端如何稳定协作，便于并行开发。

---

## 1. 产品概述

### 1.1 产品一句话
EduNexus 是一个 Web-only 的 AI 教育生态战略可视化平台，核心目标是“帮助用户学会知识与能力”，而非“一拍即得答案”。

### 1.2 产品定位
- 类型：B2B2C 教育平台（学校/机构 + 学习者 + 教师 + 成人学习者）。
- 形态：仅 Web 端（PC 优先、平板兼容、手机轻量访问）。
- 方法论：知识图谱 + 来源可信问答 + Socratic 引导学习。

### 1.3 关键原则
- 不做拍照搜题捷径，不提供默认直给答案流程；
- 所有 AI 结论尽量可追溯到来源片段；
- 学习过程数据（思路、反思、修正）高于最终答案本身。

---

## 2. 用户角色与核心任务

| 角色 | 核心任务 | 关键痛点 | 平台价值 |
|---|---|---|---|
| 学生（K12/大学） | 学习、复盘、提问、规划复习 | 知识碎片化、依赖答案 | 图谱可视化 + 分层引导 |
| 成人学习者 | 项目式学习、面试准备 | 学完不落地、缺反馈 | 项目路径 + 能力画像 |
| 教师 | 备课、批改、班级学情分析 | 重复劳动高、学情不可视 | 教师工作台 + 班级图谱 |
| 管理员/运营 | 配置策略、治理数据、监控质量 | 指标分散、不可审计 | 统一看板 + 策略中心 |

---

## 3. 范围定义（MVP / P1 / P2）

### 3.1 MVP（首发必须）
1. 学习工作区 `/workspace`（Socratic 分层引导 + 来源引用）
2. 知识图谱 `/graph`（个人图谱 + 节点掌握度）
3. 路径规划 `/path`（动态学习计划 + 复习队列）
4. 生态总览 `/dashboard`（核心指标与飞轮可视化）
5. 基础账号与权限（学生/教师/管理员）

### 3.2 P1（第二阶段）
1. 教师工作台 `/teacher`（备课、班级洞察）
2. 成人学习 `/career`（项目学习 + 面试模拟）
3. Companion `/companion`（轻量状态感知与节奏建议）

### 3.3 P2（第三阶段）
1. 文化实验室 `/culture`（国学/非遗专题）
2. Admin 高级治理 `/admin`（审计、成本优化、策略实验）

---

## 4. 页面级需求清单（Page Requirements）

### 4.1 页面总表

| 页面 | 路由 | 优先级 | 负责人建议 |
|---|---|---|---|
| 生态总览 | `/dashboard` | MVP | FE + Data |
| 学习工作区 | `/workspace` | MVP | FE + Agent |
| 知识图谱 | `/graph` | MVP | FE 3D + Graph |
| 学习路径 | `/path` | MVP | FE + Planner |
| 教师工作台 | `/teacher` | P1 | FE + TeacherOS |
| 成人技能 | `/career` | P1 | FE + Skill |
| 学习陪伴 | `/companion` | P1 | FE + Companion |
| 文化实验室 | `/culture` | P2 | FE + Content |
| 管理后台 | `/admin` | P2 | FE + Platform |

### 4.2 `/dashboard` 生态总览

- 页面目标：展示平台级学习成效、活跃度、模块协同效率。
- 核心区块：
  - 生态飞轮图（学习 -> 图谱 -> 教学 -> 能力）；
  - KPI 卡片（学习增益、独立完成率、引用覆盖率）；
  - 风险告警（高提示依赖、低反思完成率）。
- 关键需求：
  - `PAG-DB-001` 可按组织/班级/时间筛选；
  - `PAG-DB-002` 支持 drill-down 到个人或班级；
  - `PAG-DB-003` 所有图表支持导出 PNG/CSV。
- 验收标准：
  - 首屏加载 < 2.5s（缓存命中情况下）；
  - KPI 与底层口径一致，误差 < 0.1%；
  - 任一图表点击后 1s 内完成下钻。

### 4.3 `/workspace` 学习工作区（核心）

- 页面目标：以 Obsidian + NotebookLM 风格完成“学、问、证据、复盘”闭环。
- 布局：
  - 左栏：课程/笔记树 + 双链关系；
  - 中栏：Socratic 对话与任务卡；
  - 右栏：来源证据卡（引用原文、定位片段）。
- 关键需求：
  - `PAG-WS-001` 默认走分层提示，不直接给最终答案；
  - `PAG-WS-002` 用户提交当前思路后才能解锁下一层提示；
  - `PAG-WS-003` 每条关键回答必须可挂载 citation（允许“无来源”但要显式标注）；
  - `PAG-WS-004` 支持把对话片段一键沉淀为 Markdown 笔记；
  - `PAG-WS-005` 支持会话恢复与上下文连续。
- 验收标准：
  - 首次回答流式首 token < 2s；
  - citation 覆盖率 >= 85%（知识型问答）；
  - “直接要答案”会话中，>90% 被引导至分层学习流程。

### 4.4 `/graph` 知识图谱

- 页面目标：让用户“看见”知识结构与掌握演进。
- 核心区块：全局图、局部子图、时间演化、薄弱点榜单。
- 关键需求：
  - `PAG-GR-001` 支持按学科/章节/难度过滤；
  - `PAG-GR-002` 点击节点可查看证据链（错因、笔记、任务）；
  - `PAG-GR-003` 支持显示“遗忘风险热度”；
  - `PAG-GR-004` 支持教师查看班级聚合图（权限控制）。
- 验收标准：
  - 1k 节点规模下可流畅交互（FPS >= 30）；
  - 节点详情拉取 < 800ms；
  - 图谱筛选条件可分享（URL 参数持久化）。

### 4.5 `/path` 学习路径

- 页面目标：给出动态、可解释的学习计划与复习队列。
- 核心区块：今日任务、7日计划、计划调整建议、完成趋势。
- 关键需求：
  - `PAG-PA-001` 支持目标驱动（考试/项目/证书）生成路径；
  - `PAG-PA-002` 计划调整必须给原因（依据节点与证据）；
  - `PAG-PA-003` 支持一键重排（时间变化、进度变化）；
  - `PAG-PA-004` 完成任务后即时更新掌握度预测。
- 验收标准：
  - 路径生成 < 3s；
  - 重排成功率 >= 99%；
  - 每个任务都可追溯“为什么现在学这个”。

### 4.6 `/teacher` 教师工作台（P1）

- 关键需求：
  - `PAG-TE-001` 基于班级薄弱点生成备课建议；
  - `PAG-TE-002` 主观题批改输出“分项 + 依据 + 可复核”；
  - `PAG-TE-003` 生成班级错因 TopN 与下节课策略建议。
- 验收标准：
  - 备课草案生成 < 10s；
  - 批改结果支持人工二次编辑与审计。

### 4.7 `/career` 成人技能（P1）

- 关键需求：
  - `PAG-CA-001` 初始能力诊断并生成项目学习路径；
  - `PAG-CA-002` 项目任务支持提交、点评、复盘；
  - `PAG-CA-003` 面试模拟可追问并输出短板画像。
- 验收标准：
  - 每个阶段产出可导出能力证据卡；
  - 面试报告含“证据句 + 改进建议 + 下一步任务”。

### 4.8 `/companion` 学习陪伴（P1）

- 关键需求：
  - `PAG-CO-001` 记录专注/疲劳趋势（轻量，不做医疗诊断）；
  - `PAG-CO-002` 触发节奏建议（休息、降难、复盘）；
  - `PAG-CO-003` 用户可关闭或调整感知强度。
- 验收标准：
  - 默认隐私最小化，仅存状态特征，不存原始视频流。

### 4.9 `/culture` 与 `/admin`（P2）

- `PAG-CU-*`：国学/非遗专题学习体验与内容运营工具；
- `PAG-AD-*`：策略中心、审计日志、成本治理与模型路由配置。

---

## 5. 模块级需求清单（Module Requirements）

### 5.1 身份与权限模块（Auth/RBAC）
- `MOD-AU-001` 支持学生/教师/管理员角色；
- `MOD-AU-002` 资源级权限控制（班级图谱、组织数据）；
- `MOD-AU-003` 关键操作审计（导出、策略修改）。

### 5.2 笔记与知识网络模块（Obsidian 风格）
- `MOD-NO-001` Markdown 笔记、双向链接、反向链接；
- `MOD-NO-002` 笔记与知识节点双向关联；
- `MOD-NO-003` Graph View（局部/全局切换）。

### 5.3 来源可信模块（NotebookLM 风格）
- `MOD-CI-001` 来源上传、切块、索引、版本管理；
- `MOD-CI-002` 问答输出附 citation 引用；
- `MOD-CI-003` 引文失效检测与再索引机制。

### 5.4 Socratic 引导模块（反答案捷径）
- `MOD-SO-001` 分层提示策略（概念 -> 框架 -> 步骤 -> 答案）；
- `MOD-SO-002` 答案解锁门控（思路输入/反思题）；
- `MOD-SO-003` 教师可配置门控强度与策略模板。

### 5.5 Learning Graph Engine 模块
- `MOD-LG-001` 节点掌握度更新；
- `MOD-LG-002` 错因映射与关系边权更新；
- `MOD-LG-003` 复习优先队列与遗忘风险预测。

### 5.6 TeacherOS 模块（P1）
- `MOD-TE-001` 备课生成器（目标、例题、活动、作业）；
- `MOD-TE-002` 主观题批改器（规则+引用+复核）；
- `MOD-TE-003` 班级学情热力与策略建议。

### 5.7 Career Studio 模块（P1）
- `MOD-CA-001` 技能诊断；
- `MOD-CA-002` 项目路径管理；
- `MOD-CA-003` 面试模拟与能力报告。

### 5.8 观测与治理模块（Observability）
- `MOD-OB-001` traceId 贯穿前后端；
- `MOD-OB-002` 模型调用成本、时延、失败率看板；
- `MOD-OB-003` 幻觉与“无引用回答”质量告警。

---

## 6. 接口级需求清单（API Requirements）

### 6.1 接口规范
- 协议：REST + SSE（流式响应）；
- 认证：`Authorization: Bearer <token>`；
- 统一响应：
  - 成功：`{ success: true, data, traceId }`
  - 失败：`{ success: false, error: { code, message, details }, traceId }`

### 6.2 工作区与 Socratic 接口

| 接口ID | Method | Path | 说明 |
|---|---|---|---|
| API-WS-001 | POST | `/api/workspace/session` | 创建学习会话 |
| API-WS-002 | POST | `/api/workspace/socratic/next` | 请求下一层提示 |
| API-WS-003 | POST | `/api/workspace/socratic/unlock-final` | 尝试解锁最终答案 |
| API-WS-004 | GET | `/api/workspace/session/{id}/stream` | 获取流式回复（SSE） |
| API-WS-005 | POST | `/api/workspace/note/save` | 对话片段沉淀为笔记 |

### 6.3 引用与来源接口

| 接口ID | Method | Path | 说明 |
|---|---|---|---|
| API-CI-001 | POST | `/api/sources/upload` | 上传来源文档 |
| API-CI-002 | GET | `/api/sources/{id}/chunks` | 查看切块 |
| API-CI-003 | POST | `/api/citations/resolve` | 解析 citation 对应原文 |

### 6.4 图谱与路径接口

| 接口ID | Method | Path | 说明 |
|---|---|---|---|
| API-GR-001 | GET | `/api/graph/view` | 获取图谱视图数据 |
| API-GR-002 | GET | `/api/graph/node/{nodeId}` | 获取节点详情与证据链 |
| API-PA-001 | POST | `/api/path/generate` | 生成学习路径 |
| API-PA-002 | POST | `/api/path/replan` | 重排学习计划 |
| API-PA-003 | POST | `/api/path/task/{taskId}/complete` | 完成任务并回写状态 |

### 6.5 教师与成人模块接口（P1）

| 接口ID | Method | Path | 说明 |
|---|---|---|---|
| API-TE-001 | POST | `/api/teacher/lesson-plan/generate` | 生成备课草案 |
| API-TE-002 | POST | `/api/teacher/grading/batch` | 批量批改任务 |
| API-CA-001 | POST | `/api/career/assessment/start` | 启动能力诊断 |
| API-CA-002 | POST | `/api/career/interview/simulate` | 面试模拟 |

### 6.6 关键请求示例（Socratic 下一步）

```json
POST /api/workspace/socratic/next
{
  "sessionId": "ws_123",
  "userInput": "我觉得这题可以先用等差数列求和公式",
  "currentLevel": 1,
  "contextIds": ["note_1", "task_7"]
}
```

```json
{
  "success": true,
  "data": {
    "nextLevel": 2,
    "guidance": "很好，下一步请先列出已知条件和目标量。",
    "citations": [
      { "sourceId": "src_math_001", "chunkRef": "c_32" }
    ],
    "canUnlockFinal": false
  },
  "traceId": "tr_abc_001"
}
```

---

## 7. 数据模型草案（核心实体）

### 7.1 业务实体
- `User`：用户基础信息与角色；
- `WorkspaceSession`：学习会话；
- `Note`：Markdown 笔记与双链关系；
- `SourceDocument`：来源文档与切块；
- `Citation`：回答与来源片段映射；
- `KnowledgeNode` / `KnowledgeEdge`：图谱节点与关系；
- `LearningTask`：学习任务与完成状态；
- `LearningPlan`：计划快照与版本；
- `InterventionEvent`：节奏干预记录（Companion）。

### 7.2 审计实体
- `PolicyChangeLog`：策略变更日志；
- `ModelCallLog`：模型调用日志（成本/时延/失败）；
- `TraceLog`：链路追踪日志。

---

## 8. 非功能需求（NFR）

### 8.1 性能
- P95 接口响应 < 1.5s（非流式）；
- 流式首 token < 2s；
- 图谱 1k 节点交互保持可用。

### 8.2 安全与隐私
- API Key 仅服务端环境变量管理；
- 默认最小化采集，不保存原始敏感多媒体；
- 所有导出行为可审计。

### 8.3 可观测性
- 关键流程全链路 trace；
- 错误码体系统一；
- 支持按 `traceId` 回溯一次完整会话。

### 8.4 可维护性
- 前后端契约由 schema 驱动；
- Prompt 与策略配置版本化；
- 核心流程有自动化回归测试。

---

## 9. 里程碑与验收（建议）

### M1（第 2 周末）
- 完成 `/workspace` + `/graph` 页面骨架；
- 跑通 `API-WS-001/002/004` 与 `API-GR-001`。

### M2（第 4 周末）
- MVP 四页（dashboard/workspace/graph/path）可演示；
- Socratic 分层 + citation 链路可用。

### M3（第 8 周末）
- P1 模块（teacher/career/companion）上线 Beta；
- 支持组织级试点与数据报表。

---

## 10. 未决问题（需产品/业务确认）

1. K12 与成人是否共用同一套 Socratic 门控策略，还是分策略中心？
2. 教师对“最终答案解锁阈值”是否有班级级别配置权限？
3. 文化实验室优先专题（国学/非遗）首发哪个方向？
4. 试点客户更偏学校内网部署，还是优先 SaaS 公开云？

---

## 11. 开发交付建议（从 PRD 到工单）

- 将 `PAG-* / MOD-* / API-*` 直接映射为 Jira/GitHub Projects 的 issue key；
- 每条需求配 3 项最小字段：负责人、截止日期、验收截图或接口回执；
- 每周固定做一次“需求口径校准”，避免页面实现和策略目标偏离。
