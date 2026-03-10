# EduNexus 移动端适配

完整的移动端适配实现，提供原生般的移动体验。

## 快速开始

```tsx
import { useIsMobile } from '@/lib/hooks/use-media-query';
import { MobileNav } from '@/components/mobile';

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* 你的内容 */}
      {isMobile && <MobileNav />}
    </>
  );
}
```

## 核心特性

### ✅ 响应式布局
- 支持 320px - 768px 移动设备
- 自动适配平板和桌面端
- 流畅的断点切换

### ✅ 移动端导航
- 底部导航栏（5 个主要入口）
- 侧滑菜单（完整导航）
- 安全区域适配

### ✅ 触摸交互
- 滑动手势（上下左右）
- 捏合缩放
- 双击操作
- 44x44px 最小触摸目标

### ✅ 移动端组件
- 全屏搜索界面
- 下拉刷新
- 无限滚动
- 浮动操作按钮（FAB）

### ✅ 性能优化
- 图片懒加载
- 代码分割
- 虚拟滚动
- GPU 加速

## 文档

- [完整实现文档](../../docs/MOBILE_ADAPTATION.md) - 详细的技术文档
- [快速开始指南](../../docs/MOBILE_QUICKSTART.md) - 快速集成指南
- [测试指南](../../docs/MOBILE_TESTING.md) - 完整的测试清单

## 组件列表

### 导航组件
- `MobileNav` - 底部导航栏
- `MobileHeader` - 顶部栏
- `MobileMenu` - 侧滑菜单

### 交互组件
- `MobileSearch` - 全屏搜索
- `PullToRefresh` - 下拉刷新
- `InfiniteScroll` - 无限滚动
- `MobileFAB` - 浮动操作按钮

### 布局组件
- `MobileKBLayout` - 知识宝库布局
- `MobileWorkspaceLayout` - 工作区布局
- `MobileGraphLayout` - 星图布局

## Hooks

### 媒体查询
```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/lib/hooks';

const isMobile = useIsMobile(); // < 768px
const isTablet = useIsTablet(); // 769px - 1024px
const isDesktop = useIsDesktop(); // > 1025px
```

### 触摸手势
```tsx
import { useTouchGesture } from '@/lib/hooks';

const ref = useTouchGesture({
  onSwipeLeft: () => console.log('左滑'),
  onSwipeRight: () => console.log('右滑'),
  onPinch: (scale) => console.log('缩放', scale),
  onDoubleTap: () => console.log('双击'),
});

<div ref={ref}>可交互内容</div>
```

### 安全区域
```tsx
import { useSafeArea } from '@/lib/hooks';

const safeArea = useSafeArea();

<div style={{ paddingTop: `${safeArea.top}px` }}>
  内容
</div>
```

### 屏幕方向
```tsx
import { useOrientation } from '@/lib/hooks';

const orientation = useOrientation(); // "portrait" | "landscape"
```

## 样式系统

### Tailwind 响应式类
```tsx
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  响应式内容
</div>
```

### 移动端专属类
```tsx
<div className="mobile-card touch-feedback">
  移动端卡片
</div>

<button className="touch-target">
  触摸按钮
</button>
```

## 使用示例

### 响应式页面
```tsx
"use client";

import { useIsMobile } from '@/lib/hooks';
import { MobileKBLayout } from '@/components/mobile';

export default function KBPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileKBLayout
        onNewDocument={() => {}}
        onSearch={(query) => {}}
        onRefresh={async () => {}}
      >
        {/* 内容 */}
      </MobileKBLayout>
    );
  }

  return <div>{/* 桌面端布局 */}</div>;
}
```

### 下拉刷新
```tsx
import { PullToRefresh } from '@/components/mobile';

<PullToRefresh onRefresh={async () => {
  await fetchData();
}}>
  {/* 内容 */}
</PullToRefresh>
```

### 无限滚动
```tsx
import { InfiniteScroll } from '@/components/mobile';

<InfiniteScroll
  onLoadMore={async () => {
    await loadMore();
  }}
  hasMore={hasMore}
>
  {/* 列表内容 */}
</InfiniteScroll>
```

## 测试

### 浏览器测试
```bash
# Chrome DevTools
1. F12 打开开发者工具
2. Ctrl+Shift+M 切换设备模式
3. 选择 iPhone 12 Pro
4. 测试功能
```

### 真机测试
```bash
# 启动开发服务器
pnpm dev

# 在移动设备访问
http://your-ip:3000
```

### 性能测试
```bash
# Lighthouse 测试
lighthouse https://your-app.com --preset=mobile --view
```

## 性能指标

| 指标 | 目标 | 说明 |
|------|------|------|
| 首屏加载 | < 3s | 首次内容绘制 |
| 交互延迟 | < 100ms | 点击响应时间 |
| 滚动帧率 | 60fps | 流畅滚动 |
| Lighthouse | > 90 | 性能评分 |

## 浏览器支持

- ✅ Safari (iOS 15+)
- ✅ Chrome (Android)
- ✅ 微信内置浏览器
- ✅ 支付宝内置浏览器

## 最佳实践

1. **触摸目标**: 确保所有可点击元素至少 44x44px
2. **字体大小**: 输入框使用 16px 以上字体
3. **安全区域**: 处理刘海屏和圆角屏幕
4. **性能优化**: 使用懒加载和代码分割
5. **测试**: 在真机上测试所有功能

## 常见问题

### Q: 移动端导航不显示？
A: 确保屏幕宽度 < 768px，或检查 `useIsMobile()` hook。

### Q: 触摸手势不工作？
A: 确保元素有 `ref` 并使用了 `useTouchGesture` hook。

### Q: 虚拟键盘遮挡输入框？
A: 使用 `viewport-fit=cover` 并监听 `visualViewport` 事件。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

MIT License

---

**版本**: 1.0.0
**最后更新**: 2026-03-10
