# PWA 快速开始指南

## 快速设置（5 分钟）

### 1. 安装依赖

```bash
cd apps/web
pnpm install
```

### 2. 生成 VAPID Keys

```bash
node scripts/generate-vapid-keys.mjs
```

将输出的 keys 复制到 `.env.local` 文件：

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=生成的公钥
VAPID_PRIVATE_KEY=生成的私钥
```

### 3. 生成占位图标（可选）

如果还没有准备好图标，可以先生成占位图标：

```bash
# 需要先安装 canvas
pnpm add -D canvas

# 生成占位图标
node scripts/generate-placeholder-icons.mjs
```

或者手动创建简单的图标文件放在 `public/icons/` 目录。

### 4. 启动开发服务器

```bash
pnpm dev
```

### 5. 测试 PWA 功能

1. 在浏览器中打开 http://localhost:3000
2. 打开 Chrome DevTools (F12)
3. 切换到 "Application" 标签
4. 检查：
   - ✓ Manifest
   - ✓ Service Workers
   - ✓ Cache Storage

## 验证清单

- [ ] Service Worker 已注册
- [ ] Manifest 配置正确
- [ ] 图标文件存在
- [ ] 离线页面可访问
- [ ] 安装提示显示（等待 30 秒）
- [ ] 通知权限请求（等待 1 分钟）

## 常见问题

### Service Worker 未注册？

确保：
1. 使用 HTTPS 或 localhost
2. `public/sw.js` 文件存在
3. 浏览器支持 Service Worker

### 图标不显示？

1. 检查 `public/icons/` 目录是否有图标文件
2. 验证 `manifest.json` 中的路径
3. 清除浏览器缓存重试

### 推送通知不工作？

1. 确认已配置 VAPID keys
2. 检查通知权限是否授予
3. 验证订阅是否成功

## 下一步

- 阅读完整文档: `docs/PWA_IMPLEMENTATION.md`
- 生成正式图标: `public/icons/README.md`
- 自定义 Service Worker 缓存策略
- 配置推送通知场景

## 生产部署

### 1. 构建应用

```bash
pnpm build
```

### 2. 验证构建

```bash
pnpm start
```

### 3. 使用 Lighthouse 测试

1. 打开 Chrome DevTools
2. 切换到 "Lighthouse" 标签
3. 选择 "Progressive Web App"
4. 点击 "Generate report"
5. 确保 PWA 评分 > 90

### 4. 部署到服务器

确保：
- 使用 HTTPS
- 配置正确的 headers
- Service Worker 可访问

## 支持

遇到问题？查看：
- 完整文档: `docs/PWA_IMPLEMENTATION.md`
- 图标指南: `public/icons/README.md`
- GitHub Issues

---

**提示**: PWA 功能需要 HTTPS 环境才能完全工作（localhost 除外）。
