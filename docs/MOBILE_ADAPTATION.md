# EduNexus 移动端适配实现文档

## 概述

本文档详细说明了 EduNexus 平台的移动端适配实现，包括响应式布局、移动端专属组件、触摸交互优化和性能优化等方面。

## 目录

- [技术栈](#技术栈)
- [核心功能](#核心功能)
- [组件架构](#组件架构)
- [使用指南](#使用指南)
- [最佳实践](#最佳实践)
- [性能优化](#性能优化)
- [测试建议](#测试建议)

---

## 技术栈

### 核心技术
- **React 18.3+**: 使用最新的 React 特性
- **Next.js 14**: 服务端渲染和路由
- **TypeScript**: 类型安全
- **Tailwind CSS**: 响应式样式
- **Framer Motion**: 流畅动画

### 移动端特性
- **媒体查询**: 响应式断点检测
- **触摸手势**: 滑动、捏合、双击
- **安全区域**: 刘海屏适配
- **屏幕方向**: 横竖屏切换

---

## 核心功能

### 1. 响应式布局

#### 断点定义
```typescript
// 移动端: 320px - 768px
// 平板端: 769px - 1024px
// 桌面端: 1025px+
```

#### 使用方式
```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/lib/hooks/use-media-query';

function MyComponent() {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
      {/* 内容 */}
    </div>
  );
}
```

### 2. 移动端导航

#### 底部导航栏 (MobileNav)
- 5 个主要入口：总览、星图、宝库、工作区、设置
- 固定在底部，支持安全区域
- 活动状态指示

```tsx
import { MobileNav } from '@/components/mobile/mobile-nav';

// 在 AppShell 中自动显示
<MobileNav />
```

#### 侧滑菜单 (MobileMenu)
- 全屏侧滑菜单
- 显示所有导航项
- 流畅的动画效果

```tsx
import { MobileMenu } from '@/components/mobile/mobile-menu';

const [isOpen, setIsOpen] = useState(false);

<MobileMenu
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### 3. 移动端搜索

#### 全屏搜索界面 (MobileSearch)
- 全屏搜索体验
- 历史记录和热门搜索
- 自动聚焦输入框

```tsx
import { MobileSearch } from '@/components/mobile/mobile-search';

<MobileSearch
  isOpen={isSearchOpen}
  onClose={() => setIsSearchOpen(false)}
  onSearch={(query) => console.log(query)}
  placeholder="搜索知识、笔记..."
  recentSearches={["React", "TypeScript"]}
  popularSearches={["前端开发", "算法"]}
/>
```

### 4. 下拉刷新

#### PullToRefresh 组件
- 原生般的下拉刷新体验
- 自定义阈值和最大拉动距离
- 阻尼效果

```tsx
import { PullToRefresh } from '@/components/mobile/pull-to-refresh';

<PullToRefresh
  onRefresh={async () => {
    await fetchData();
  }}
  threshold={80}
  maxPullDistance={120}
>
  {/* 内容 */}
</PullToRefresh>
```

### 5. 无限滚动

#### InfiniteScroll 组件
- 自动加载更多内容
- Intersection Observer 实现
- 加载状态指示

```tsx
import { InfiniteScroll } from '@/components/mobile/infinite-scroll';

<InfiniteScroll
  onLoadMore={async () => {
    await loadMoreData();
  }}
  hasMore={hasMore}
  threshold={200}
>
  {/* 列表内容 */}
</InfiniteScroll>
```

### 6. 浮动操作按钮

#### MobileFAB 组件
- 主要操作的快捷入口
- 支持图标和文字
- 可自定义位置

```tsx
import { MobileFAB } from '@/components/mobile/mobile-fab';

<MobileFAB
  icon={<Plus className="h-6 w-6" />}
  onClick={() => createNew()}
  label="新建"
  position="bottom-right"
/>
```

---

## 组件架构

### Hooks

#### 1. useMediaQuery
```typescript
// 基础媒体查询 Hook
const matches = useMediaQuery("(max-width: 768px)");

// 预定义断点
const isMobile = useIsMobile();
const isTablet = useIsTablet();
const isDesktop = useIsDesktop();
const isSmallMobile = useIsSmallMobile();
```

#### 2. useTouchGesture
```typescript
// 触摸手势支持
const ref = useTouchGesture<HTMLDivElement>({
  onSwipeLeft: () => console.log("向左滑动"),
  onSwipeRight: () => console.log("向右滑动"),
  onSwipeUp: () => console.log("向上滑动"),
  onSwipeDown: () => console.log("向下滑动"),
  onPinch: (scale) => console.log("捏合缩放", scale),
  onDoubleTap: () => console.log("双击"),
  threshold: 50,
});

<div ref={ref}>可滑动内容</div>
```

#### 3. useSafeArea
```typescript
// 安全区域适配
const safeArea = useSafeArea();

<div style={{
  paddingTop: `${safeArea.top}px`,
  paddingBottom: `${safeArea.bottom}px`,
}}>
  内容
</div>
```

#### 4. useOrientation
```typescript
// 屏幕方向检测
const orientation = useOrientation(); // "portrait" | "landscape"

{orientation === "landscape" && (
  <div>横屏模式</div>
)}
```

### 移动端组件

```
apps/web/src/components/mobile/
├── mobile-nav.tsx           # 底部导航栏
├── mobile-header.tsx        # 顶部栏
├── mobile-menu.tsx          # 侧滑菜单
├── mobile-search.tsx        # 全屏搜索
├── pull-to-refresh.tsx      # 下拉刷新
├── infinite-scroll.tsx      # 无限滚动
├── mobile-fab.tsx           # 浮动操作按钮
└── mobile-kb-layout.tsx     # 知识宝库移动布局
```

---

## 使用指南

### 1. 页面适配示例

#### 知识宝库页面
```tsx
"use client";

import { useState } from "react";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import { MobileKBLayout } from "@/components/mobile/mobile-kb-layout";

export default function KBPage() {
  const isMobile = useIsMobile();
  const [documents, setDocuments] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handleRefresh = async () => {
    // 刷新数据
    const data = await fetchDocuments();
    setDocuments(data);
  };

  const handleLoadMore = async () => {
    // 加载更多
    const moreData = await fetchMoreDocuments();
    setDocuments([...documents, ...moreData]);
    setHasMore(moreData.length > 0);
  };

  const handleSearch = (query: string) => {
    // 搜索逻辑
    console.log("搜索:", query);
  };

  const handleNewDocument = () => {
    // 创建新文档
    console.log("新建文档");
  };

  if (isMobile) {
    return (
      <MobileKBLayout
        onNewDocument={handleNewDocument}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      >
        {/* 文档列表 */}
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </MobileKBLayout>
    );
  }

  // 桌面端布局
  return (
    <div className="desktop-layout">
      {/* 桌面端内容 */}
    </div>
  );
}
```

### 2. 响应式组件示例

```tsx
"use client";

import { useIsMobile } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

export function ResponsiveCard({ title, content }: Props) {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "rounded-lg border p-4",
      isMobile ? "mobile-card" : "desktop-card"
    )}>
      <h3 className={cn(
        "font-semibold",
        isMobile ? "text-base" : "text-lg"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-muted-foreground",
        isMobile ? "text-sm" : "text-base"
      )}>
        {content}
      </p>
    </div>
  );
}
```

### 3. 触摸手势示例

```tsx
"use client";

import { useTouchGesture } from "@/lib/hooks/use-touch-gesture";
import { useState } from "react";

export function SwipeableCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ref = useTouchGesture<HTMLDivElement>({
    onSwipeLeft: () => setCurrentIndex(i => i + 1),
    onSwipeRight: () => setCurrentIndex(i => Math.max(0, i - 1)),
    threshold: 50,
  });

  return (
    <div ref={ref} className="swipeable-container">
      <div className="card">
        卡片 {currentIndex}
      </div>
    </div>
  );
}
```

---

## 最佳实践

### 1. 触摸目标尺寸

确保所有可交互元素至少 44x44px：

```tsx
// ✅ 正确
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon className="h-5 w-5" />
</button>

// ❌ 错误
<button className="p-1">
  <Icon className="h-3 w-3" />
</button>
```

### 2. 字体大小

移动端输入框使用 16px 以上字体，防止 iOS 自动缩放：

```tsx
// ✅ 正确
<input className="text-base" /> {/* 16px */}

// ❌ 错误
<input className="text-sm" /> {/* 14px，会触发缩放 */}
```

### 3. 安全区域

处理刘海屏和圆角屏幕：

```tsx
import { useSafeArea } from "@/lib/hooks/use-safe-area";

function MobileHeader() {
  const safeArea = useSafeArea();

  return (
    <header style={{ paddingTop: `${safeArea.top}px` }}>
      {/* 内容 */}
    </header>
  );
}
```

### 4. 性能优化

使用 CSS 类而不是内联样式：

```tsx
// ✅ 正确
<div className="mobile-card touch-feedback">
  内容
</div>

// ❌ 避免
<div style={{
  padding: "16px",
  borderRadius: "12px",
  transition: "all 0.2s"
}}>
  内容
</div>
```

### 5. 图片优化

使用响应式图片和懒加载：

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="描述"
  width={800}
  height={600}
  loading="lazy"
  className="rounded-lg"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## 性能优化

### 1. 代码分割

移动端组件按需加载：

```tsx
import dynamic from "next/dynamic";

const MobileSearch = dynamic(
  () => import("@/components/mobile/mobile-search").then(m => m.MobileSearch),
  { ssr: false }
);
```

### 2. 虚拟滚动

长列表使用虚拟滚动：

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. 图片懒加载

使用 Intersection Observer：

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function LazyImage({ src, alt }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : "/placeholder.jpg"}
      alt={alt}
      loading="lazy"
    />
  );
}
```

### 4. 减少重渲染

使用 React.memo 和 useMemo：

```tsx
import { memo, useMemo } from "react";

export const MobileCard = memo(function MobileCard({ data }: Props) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

---

## 测试建议

### 1. 设备测试

#### 必测设备
- **iPhone SE (375px)**: 小屏幕
- **iPhone 12/13/14 (390px)**: 标准屏幕
- **iPhone 14 Pro Max (430px)**: 大屏幕
- **iPad Mini (768px)**: 平板
- **Android 中端机**: 性能测试

### 2. 浏览器测试

- Safari (iOS)
- Chrome (Android)
- 微信内置浏览器
- 支付宝内置浏览器

### 3. 功能测试清单

- [ ] 底部导航栏正常显示和切换
- [ ] 侧滑菜单流畅打开和关闭
- [ ] 下拉刷新正常工作
- [ ] 无限滚动自动加载
- [ ] 搜索界面正常显示
- [ ] 触摸手势响应正确
- [ ] 安全区域正确适配
- [ ] 横竖屏切换正常
- [ ] 虚拟键盘弹出不遮挡内容
- [ ] 图片懒加载正常
- [ ] 性能流畅，无卡顿

### 4. 性能测试

使用 Chrome DevTools 的 Lighthouse：

```bash
# 移动端性能测试
lighthouse https://your-app.com --preset=mobile --view

# 目标指标
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 90
# SEO: > 90
```

### 5. 自动化测试

```tsx
// 移动端组件测试示例
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileNav } from "@/components/mobile/mobile-nav";

describe("MobileNav", () => {
  it("应该渲染所有导航项", () => {
    render(<MobileNav />);
    expect(screen.getByText("总览")).toBeInTheDocument();
    expect(screen.getByText("星图")).toBeInTheDocument();
    expect(screen.getByText("宝库")).toBeInTheDocument();
  });

  it("应该高亮当前活动项", () => {
    render(<MobileNav />);
    const activeItem = screen.getByText("总览").closest("a");
    expect(activeItem).toHaveClass("text-primary");
  });
});
```

---

## 样式系统

### Tailwind 响应式类

```tsx
// 移动端优先
<div className="
  text-sm          // 移动端 14px
  md:text-base     // 平板端 16px
  lg:text-lg       // 桌面端 18px
">
  响应式文本
</div>

// 移动端隐藏
<div className="hidden md:block">
  桌面端显示
</div>

// 移动端显示
<div className="block md:hidden">
  移动端显示
</div>
```

### 自定义移动端类

```css
/* 在 mobile.css 中定义 */
.mobile-card {
  @apply rounded-xl p-4 shadow-sm;
}

.mobile-list-item {
  @apply flex items-center gap-3 p-4 active:bg-accent;
}

.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 常见问题

### 1. iOS 滚动卡顿

```css
/* 启用惯性滚动 */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```

### 2. 虚拟键盘遮挡输入框

```tsx
useEffect(() => {
  const handleResize = () => {
    if (window.visualViewport) {
      const viewport = window.visualViewport;
      document.body.style.height = `${viewport.height}px`;
    }
  };

  window.visualViewport?.addEventListener("resize", handleResize);
  return () => {
    window.visualViewport?.removeEventListener("resize", handleResize);
  };
}, []);
```

### 3. 点击延迟

```css
/* 移除 300ms 点击延迟 */
* {
  touch-action: manipulation;
}
```

### 4. 横屏适配

```tsx
const orientation = useOrientation();

<div className={cn(
  "container",
  orientation === "landscape" && "landscape-layout"
)}>
  内容
</div>
```

---

## 未来优化

### 1. PWA 支持
- 添加 Service Worker
- 离线缓存
- 添加到主屏幕

### 2. 手势增强
- 长按菜单
- 拖拽排序
- 多点触控

### 3. 性能监控
- 集成性能监控工具
- 用户体验指标收集
- 错误追踪

### 4. 无障碍优化
- 屏幕阅读器支持
- 键盘导航
- 高对比度模式

---

## 总结

EduNexus 的移动端适配提供了完整的移动端体验，包括：

✅ 响应式布局（320px - 768px）
✅ 移动端专属导航（底部导航栏 + 侧滑菜单）
✅ 触摸友好的交互（44x44px 最小触摸目标）
✅ 手势支持（滑动、捏合、双击）
✅ 下拉刷新和无限滚动
✅ 全屏搜索界面
✅ 安全区域适配（刘海屏）
✅ 横竖屏支持
✅ 性能优化（懒加载、代码分割）

通过这些优化，EduNexus 在移动端提供了流畅、原生般的用户体验。

---

## 参考资源

- [React 官方文档](https://react.dev/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 响应式设计](https://tailwindcss.com/docs/responsive-design)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Web.dev 移动端最佳实践](https://web.dev/mobile/)
- [MDN 触摸事件](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-10
**维护者**: EduNexus 开发团队
