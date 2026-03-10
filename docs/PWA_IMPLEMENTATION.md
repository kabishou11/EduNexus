# PWA Implementation Documentation

## 概述

EduNexus 现已完整支持 Progressive Web App (PWA) 功能，提供离线访问、应用安装、推送通知等现代 Web 应用特性。

## 核心功能

### 1. 离线功能

#### Service Worker
- **位置**: `/public/sw.js`
- **版本**: v1
- **缓存策略**:
  - **Cache First**: 静态资源（JS、CSS、字体、图片）
  - **Network First**: API 请求和 HTML 页面
  - **Stale While Revalidate**: 默认策略

#### 缓存管理
- 自动缓存静态资源
- 智能缓存 API 响应
- 定期清理过期缓存
- 缓存大小限制：50 项
- 缓存有效期：7 天

#### 离线存储
- 使用 IndexedDB 存储离线数据
- 支持离线操作队列
- 自动同步离线数据
- 存储配额管理

### 2. 应用安装

#### Web App Manifest
- **位置**: `/public/manifest.json`
- **应用名称**: EduNexus - AI 教育生态平台
- **显示模式**: standalone（独立窗口）
- **主题色**: #3b82f6（蓝色）
- **背景色**: #ffffff（白色）

#### 应用图标
支持多种尺寸的图标（需要生成）:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

#### 安装提示
- 自动检测安装条件
- 延迟 30 秒后显示提示
- 支持用户主动安装
- 记录用户选择（7 天内不再提示）

### 3. 推送通知

#### 通知类型
1. **学习提醒**
   - 每日学习提醒
   - 目标截止提醒
   - 学习计划提醒

2. **社交通知**
   - 评论通知
   - 点赞通知
   - 关注通知

3. **系统通知**
   - 应用更新
   - 系统公告
   - 重要消息

#### 通知权限
- 智能请求时机（用户活跃 1 分钟后）
- 支持用户主动开启/关闭
- 记录用户选择

#### 推送订阅
- 使用 VAPID 协议
- 自动订阅管理
- 支持批量推送

### 4. 高级 PWA 特性

#### 应用快捷方式
在 manifest.json 中定义了 4 个快捷方式：
- 知识库
- 工作空间
- 练习
- 分析

#### 分享目标
支持从其他应用分享内容到 EduNexus：
- 文本分享
- URL 分享
- 文件分享（文本、PDF、图片）

#### 应用徽章
- 显示未读消息数量
- 自动更新徽章
- 支持清除徽章

## 技术实现

### 文件结构

```
apps/web/
├── public/
│   ├── manifest.json          # Web App Manifest
│   ├── sw.js                  # Service Worker
│   └── icons/                 # 应用图标
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── push/
│   │   │       ├── subscribe/route.ts  # 推送订阅 API
│   │   │       └── send/route.ts       # 推送发送 API
│   │   ├── offline/
│   │   │   └── page.tsx               # 离线页面
│   │   └── share/
│   │       └── page.tsx               # 分享目标页面
│   │
│   ├── components/
│   │   └── pwa/
│   │       ├── install-prompt.tsx          # 安装提示
│   │       ├── offline-indicator.tsx       # 离线指示器
│   │       ├── notification-permission.tsx # 通知权限
│   │       ├── update-prompt.tsx           # 更新提示
│   │       └── pwa-init.tsx               # PWA 初始化
│   │
│   └── lib/
│       └── pwa/
│           ├── service-worker-manager.ts  # SW 管理器
│           ├── cache-manager.ts           # 缓存管理器
│           ├── push-manager.ts            # 推送管理器
│           ├── offline-storage.ts         # 离线存储
│           └── pwa-utils.ts              # PWA 工具函数
```

### 核心类

#### ServiceWorkerManager
管理 Service Worker 的注册、更新和生命周期。

```typescript
import { swManager } from '@/lib/pwa/service-worker-manager';

// 注册 Service Worker
await swManager.register();

// 检查更新
await swManager.checkForUpdates();

// 跳过等待并激活新版本
swManager.skipWaiting();

// 获取版本
const version = await swManager.getVersion();

// 清除所有缓存
await swManager.clearCaches();
```

#### CacheManager
管理缓存操作和策略。

```typescript
import { cacheManager } from '@/lib/pwa/cache-manager';

// 添加到缓存
await cacheManager.add('/api/data', { maxAge: 3600000 });

// 从缓存获取
const response = await cacheManager.get('/api/data');

// 预加载资源
await cacheManager.preload(['/page1', '/page2']);

// 清除所有缓存
await cacheManager.clearAll();
```

#### PushManager
管理推送通知订阅和发送。

```typescript
import { pushManager } from '@/lib/pwa/push-manager';

// 订阅推送
await pushManager.subscribe();

// 取消订阅
await pushManager.unsubscribe();

// 显示本地通知
await pushManager.showNotification({
  title: '学习提醒',
  body: '该学习了！',
  tag: 'study-reminder',
});
```

#### OfflineStorage
管理离线数据存储（IndexedDB）。

```typescript
import { offlineStorage } from '@/lib/pwa/offline-storage';

// 初始化
await offlineStorage.init();

// 添加离线操作
await offlineStorage.addOfflineAction({
  url: '/api/save',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// 缓存数据
await offlineStorage.setCachedData('user-profile', userData, 3600000);

// 获取缓存数据
const userData = await offlineStorage.getCachedData('user-profile');
```

### PWA 工具函数

```typescript
import {
  isInstalled,
  isOnline,
  isOffline,
  isMobile,
  share,
  setBadgeCount,
  clearBadge,
} from '@/lib/pwa/pwa-utils';

// 检查是否已安装
if (isInstalled()) {
  console.log('App is installed');
}

// 检查网络状态
if (isOnline()) {
  console.log('Device is online');
}

// 分享内容
await share({
  title: '分享标题',
  text: '分享内容',
  url: 'https://example.com',
});

// 设置应用徽章
await setBadgeCount(5);

// 清除徽章
await clearBadge();
```

## 环境变量配置

在 `.env.local` 文件中添加以下配置：

```env
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### 生成 VAPID Keys

使用 web-push 库生成 VAPID keys：

```bash
npx web-push generate-vapid-keys
```

## 使用指南

### 1. 安装依赖

```bash
cd apps/web
pnpm install
```

### 2. 生成应用图标

使用在线工具或脚本生成多尺寸图标：
- 推荐工具: [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- 或使用: [RealFaviconGenerator](https://realfavicongenerator.net/)

```bash
# 使用 PWA Asset Generator
npx pwa-asset-generator logo.png public/icons --icon-only
```

### 3. 配置 VAPID Keys

```bash
# 生成 VAPID keys
npx web-push generate-vapid-keys

# 将生成的 keys 添加到 .env.local
```

### 4. 启动开发服务器

```bash
pnpm dev
```

### 5. 测试 PWA 功能

#### 使用 Chrome DevTools
1. 打开 Chrome DevTools (F12)
2. 切换到 "Application" 标签
3. 检查以下内容：
   - Manifest
   - Service Workers
   - Cache Storage
   - IndexedDB
   - Notifications

#### 使用 Lighthouse
1. 打开 Chrome DevTools
2. 切换到 "Lighthouse" 标签
3. 选择 "Progressive Web App"
4. 点击 "Generate report"

### 6. 部署到生产环境

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start
```

## API 使用示例

### 订阅推送通知

```typescript
// 客户端
import { pushManager } from '@/lib/pwa/push-manager';

const subscription = await pushManager.subscribe();
```

### 发送推送通知

```typescript
// 服务端
const response = await fetch('/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subscription: userSubscription,
    notification: {
      title: '学习提醒',
      body: '您今天还没有完成学习任务',
      tag: 'study-reminder',
      data: { url: '/workspace' },
    },
  }),
});
```

### 批量发送通知

```typescript
const response = await fetch('/api/push/send', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subscriptions: allUserSubscriptions,
    notification: {
      title: '系统公告',
      body: '新功能上线了！',
      tag: 'announcement',
    },
  }),
});
```

## 浏览器支持

### 完全支持
- Chrome 90+
- Edge 90+
- Firefox 90+
- Safari 15.4+
- Opera 76+

### 部分支持
- Safari 11.1-15.3 (不支持推送通知)
- iOS Safari 15.4+ (支持推送通知)

### 功能检测

```typescript
import {
  isServiceWorkerSupported,
  isPushSupported,
  isBackgroundSyncSupported,
} from '@/lib/pwa/pwa-utils';

if (isServiceWorkerSupported()) {
  // 注册 Service Worker
}

if (isPushSupported()) {
  // 订阅推送通知
}

if (isBackgroundSyncSupported()) {
  // 使用后台同步
}
```

## 性能优化

### 缓存策略优化
- 静态资源使用 Cache First，减少网络请求
- API 请求使用 Network First，确保数据新鲜
- 图片使用 Stale While Revalidate，平衡性能和新鲜度

### 缓存大小管理
- 限制每个缓存最多 50 项
- 自动删除最旧的缓存项
- 定期清理过期缓存

### 离线数据同步
- 使用 Background Sync API
- 自动重试失败的请求
- 队列管理离线操作

## 安全考虑

### Service Worker 安全
- 只在 HTTPS 环境下工作
- 限制 Service Worker 作用域
- 定期更新 Service Worker

### 推送通知安全
- 使用 VAPID 协议验证
- 服务端验证订阅
- 限制推送频率

### 数据存储安全
- 不存储敏感信息
- 使用加密存储敏感数据
- 定期清理过期数据

## 故障排除

### Service Worker 未注册
1. 检查是否在 HTTPS 环境
2. 检查 sw.js 文件是否存在
3. 查看浏览器控制台错误

### 推送通知不工作
1. 检查通知权限
2. 验证 VAPID keys 配置
3. 检查订阅是否成功

### 离线功能不工作
1. 检查 Service Worker 状态
2. 查看 Cache Storage
3. 验证缓存策略

### 应用无法安装
1. 检查 manifest.json 配置
2. 验证图标文件存在
3. 确保满足安装条件

## 最佳实践

### 1. 渐进增强
- 确保核心功能在不支持 PWA 的浏览器中也能工作
- 使用功能检测而非浏览器检测
- 提供降级方案

### 2. 用户体验
- 不要过早显示安装提示
- 提供清晰的离线指示
- 优雅处理网络错误

### 3. 性能
- 只缓存必要的资源
- 定期清理缓存
- 优化 Service Worker 大小

### 4. 测试
- 在多种设备上测试
- 测试离线场景
- 使用 Lighthouse 评分

## 未来改进

### 计划功能
- [ ] 后台同步优化
- [ ] 更智能的缓存策略
- [ ] 离线编辑支持
- [ ] 更丰富的通知类型
- [ ] 应用更新策略优化

### 性能优化
- [ ] Service Worker 预缓存优化
- [ ] 缓存策略动态调整
- [ ] 离线数据压缩

### 用户体验
- [ ] 更好的安装引导
- [ ] 离线功能教程
- [ ] 通知设置页面

## 参考资源

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 支持

如有问题或建议，请联系开发团队或提交 Issue。

---

**版本**: 1.0.0
**最后更新**: 2026-03-10
**维护者**: EduNexus 开发团队
