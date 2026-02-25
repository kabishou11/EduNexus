# EduNexus 上传 GitHub 前检查清单（一期完成后）

目标仓库：`https://github.com/kabishou11/EduNexus`

---

## 1. 安全检查（必须）

- [ ] 所有 API Key 已从代码与历史记录移除。
- [ ] `.env` 已加入 `.gitignore`，仅保留 `.env.example`。
- [ ] 未提交含敏感信息的日志、调试文件、截图。
- [ ] ModelScope token 已使用新 token（旧 token 已失效）。

---

## 2. 工程检查（必须）

- [ ] `pnpm lint` 通过。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm test` 通过（至少核心流程测试）。
- [ ] `pnpm build` 通过（与 Vercel 环境一致）。
- [ ] README 完整描述本地启动与部署步骤。

---

## 3. 产品检查（一期）

- [ ] `/workspace` Socratic 分层引导可用。
- [ ] `/graph` 图谱可交互并可查看节点详情。
- [ ] `/path` 路径生成与重排可用。
- [ ] `/dashboard` 可展示一期核心 KPI。
- [ ] 本地知识库沉淀链路可用（笔记 + 索引 + 搜索）。

---

## 4. 文档检查

- [ ] PRD 文档已更新到当前实现版本。
- [ ] API 列表与实际接口保持一致。
- [ ] 架构图与目录结构与代码一致。
- [ ] 发布说明（Release Notes）已准备。

---

## 5. 上传步骤建议

1. 本地打 tag：`v0.1.0-mvp`。
2. 初始化或校验 remote：`origin -> kabishou11/EduNexus`。
3. 推送分支与 tag。
4. 在 GitHub 创建 `v0.1.0-mvp` Release。
5. 连接 Vercel 并完成 Production 首次部署。

