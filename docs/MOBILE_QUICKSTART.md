# EduNexus 移动端适配快速开始

## 快速集成指南

### 1. 基础设置

#### 安装依赖
所有必需的依赖已经在 `package.json` 中，无需额外安装。

#### 导入移动端样式
在 `globals.css` 中已自动导入：
```css
@import '../styles/mobile.css';
```

### 2. 使用移动端导航

#### 在 AppShell 中集成
`AppShell.tsx` 已经集成了移动端导航：

```tsx
import { MobileNav } from '@/components/mobile/mobile-nav';
import { useIsMobile } from '@/lib/hooks/use-media-query';

// 自动显示移动端底部导航
{isMobile && <MobileNav />}
```

### 3. 创建响应式页面

#### 基础模板
```tsx
"use client";

import { useIsMobile } from "@/lib/hooks/use-media-query";

export default function MyPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="mobile-layout">
        {/* 移动端布局 */}
      </div>
    );
  }

  return (
    <div className="desktop-layout">
      {/* 桌面端布局 */}
    </div>
  );
}
```

### 4. 常用组件示例

#### 移动端列表页
```tsx
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileFAB } from "@/components/mobile/mobile-fab";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { Plus } from "lucide-react";

export default function ListPage() {
  return (
    <>
      <MobileHeader title="列表页" />

      <PullToRefresh onRefresh={async () => {
        await fetchData();
      }}>
        <div className="p-4 space-y-4">
          {/* 列表内容 */}
        </div>
      </PullToRefresh>

      <MobileFAB
        icon={<Plus />}
        onClick={() => createNew()}
      />
    </>
  );
}
```

#### 移动端搜索
```tsx
import { useState } from "react";
import { MobileSearch } from "@/components/mobile/mobile-search";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsSearchOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>

      <MobileSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(query) => console.log(query)}
      />
    </>
  );
}
```

### 5. 触摸手势

```tsx
import { useTouchGesture } from "@/lib/hooks/use-touch-gesture";

export function SwipeableCard() {
  const ref = useTouchGesture<HTMLDivElement>({
    onSwipeLeft: () => console.log("左滑"),
    onSwipeRight: () => console.log("右滑"),
  });

  return (
    <div ref={ref} className="card">
      可滑动的卡片
    </div>
  );
}
```

### 6. 响应式样式

#### Tailwind 类
```tsx
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  响应式内容
</div>
```

#### 自定义移动端类
```tsx
<div className="mobile-card touch-feedback">
  移动端卡片
</div>
```

### 7. 测试

#### 浏览器开发者工具
1. 打开 Chrome DevTools (F12)
2. 点击设备工具栏图标 (Ctrl+Shift+M)
3. 选择设备：iPhone 12 Pro
4. 测试功能

#### 真机测试
```bash
# 启动开发服务器
pnpm dev

# 在移动设备上访问
# http://your-ip:3000
```

### 8. 常见问题

#### Q: 移动端导航不显示？
A: 确保屏幕宽度小于 768px，或使用 `useIsMobile()` hook 检查。

#### Q: 触摸手势不工作？
A: 确保元素有 `ref` 并且使用了 `useTouchGesture` hook。

#### Q: 安全区域不生效？
A: 检查 viewport meta 标签：
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

### 9. 性能优化建议

1. **图片优化**: 使用 Next.js Image 组件
2. **代码分割**: 使用 dynamic import
3. **懒加载**: 使用 Intersection Observer
4. **减少重渲染**: 使用 React.memo 和 useMemo

### 10. 下一步

- 查看完整文档: `docs/MOBILE_ADAPTATION.md`
- 查看组件示例: `apps/web/src/components/mobile/`
- 查看 Hooks 文档: `apps/web/src/lib/hooks/`

---

**快速链接**
- [完整文档](./MOBILE_ADAPTATION.md)
- [组件目录](../apps/web/src/components/mobile/)
- [Hooks 目录](../apps/web/src/lib/hooks/)
