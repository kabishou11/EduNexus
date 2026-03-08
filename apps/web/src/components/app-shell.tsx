"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const navGroups = [
  {
    title: "核心链路",
    items: [
      { href: "/", label: "总览", hint: "平台入口与能力总览" },
      { href: "/workspace", label: "学习工作区", hint: "引导学习与会话沉淀" },
      { href: "/graph", label: "知识图谱", hint: "风险关系链与批次联动" },
      { href: "/path", label: "学习路径", hint: "目标生成与任务回写" }
    ]
  },
  {
    title: "生态支撑",
    items: [
      { href: "/teacher", label: "教师工作台", hint: "教案生成与课堂改进" },
      { href: "/kb", label: "本地知识库", hint: "双链检索与证据沉淀" },
      { href: "/dashboard", label: "生态看板", hint: "趋势、风险与闭环事件" },
      { href: "/settings", label: "配置中心", hint: "模板、策略与参数管理" }
    ]
  }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<"nebula" | "aurora">("nebula");
  const [showBackTop, setShowBackTop] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const quickInputRef = useRef<HTMLInputElement | null>(null);

  const quickNavItems = useMemo(
    () =>
      navGroups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          groupTitle: group.title
        }))
      ),
    []
  );
  const currentNavItem = useMemo(
    () => quickNavItems.find((item) => isActivePath(pathname, item.href)),
    [pathname, quickNavItems]
  );
  const normalizedQuickQuery = useMemo(() => quickQuery.trim().toLowerCase(), [quickQuery]);
  const quickMatchedItems = useMemo(() => {
    if (!normalizedQuickQuery) {
      return quickNavItems.slice(0, 8);
    }
    return quickNavItems
      .filter((item) => {
        const text = `${item.label} ${item.href} ${item.groupTitle} ${item.hint ?? ""}`.toLowerCase();
        return text.includes(normalizedQuickQuery);
      })
      .slice(0, 8);
  }, [normalizedQuickQuery, quickNavItems]);

  const jumpToQuickItem = (href: string) => {
    router.push(href);
    setQuickQuery("");
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("edunexus-theme");
    if (saved === "nebula" || saved === "aurora") {
      setThemeMode(saved);
    }
  }, []);

  useEffect(() => {
    const handleThemeUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ themeMode?: unknown }>).detail;
      const nextMode = detail?.themeMode;
      if (nextMode === "nebula" || nextMode === "aurora") {
        setThemeMode(nextMode);
      }
    };
    window.addEventListener("edunexus-theme-updated", handleThemeUpdated);
    return () => {
      window.removeEventListener("edunexus-theme-updated", handleThemeUpdated);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
    window.localStorage.setItem("edunexus-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 520);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        quickInputRef.current?.focus();
        quickInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="shell">
      <aside className="shell-nav">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <h1>EduNexus</h1>
            <p>学习闭环中枢</p>
          </div>
        </div>

        {navGroups.map((group) => (
          <div className="nav-group" key={group.title}>
            <p className="nav-title">{group.title}</p>
            <nav>
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${active ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="nav-progress">
          <strong>当前系统状态</strong>
          <ul className="nav-status-list">
            <li>引导引擎：在线</li>
            <li>知识库索引：可用</li>
            <li>图谱联动：可用</li>
          </ul>
        </div>

        <div className="theme-switch">
          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setThemeMode((prev) => (prev === "nebula" ? "aurora" : "nebula"))
            }
          >
            {themeMode === "nebula" ? "切换到晨曦主题" : "切换到星夜主题"}
          </button>
          <p>当前风格：{themeMode === "nebula" ? "星夜银河" : "晨曦玻璃"}</p>
        </div>

        <div className="nav-foot">
          <p>纯 Web · LangGraph · ModelScope</p>
          <p>统一学习、图谱、路径与教学协同</p>
        </div>
      </aside>

      <main className="shell-main">
        <div className="main-backdrop" />
        <div className="shell-topbar">
          <div className="shell-topbar-route">
            <p>{currentNavItem?.groupTitle ?? "EduNexus"}</p>
            <strong>{currentNavItem?.label ?? "AI 教育生态平台"}</strong>
            <span>{currentNavItem?.hint ?? "统一学习引导、图谱分析与本地知识沉淀"}</span>
          </div>
          <div className="shell-topbar-search">
            <label htmlFor="global_nav_search">全局快速跳转</label>
            <input
              id="global_nav_search"
              ref={quickInputRef}
              value={quickQuery}
              onChange={(event) => setQuickQuery(event.target.value)}
              placeholder="输入页面名 / 功能名快速跳转（Ctrl+K）"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const target = quickMatchedItems[0];
                  if (target) {
                    jumpToQuickItem(target.href);
                  }
                }
                if (event.key === "Escape") {
                  setQuickQuery("");
                  (event.target as HTMLInputElement).blur();
                }
              }}
            />
            {normalizedQuickQuery ? (
              <div className="shell-topbar-search-results">
                {quickMatchedItems.length === 0 ? (
                  <p className="shell-topbar-search-empty">未匹配到页面，请换一个关键词。</p>
                ) : (
                  quickMatchedItems.map((item) => (
                    <button
                      key={`quick_nav_${item.href}`}
                      type="button"
                      onClick={() => jumpToQuickItem(item.href)}
                      className={isActivePath(pathname, item.href) ? "active" : ""}
                    >
                      <span>{item.label}</span>
                      <em>
                        {item.groupTitle} · {item.hint}
                      </em>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="shell-topbar-shortcuts">
                {quickNavItems.slice(0, 4).map((item) => (
                  <button
                    key={`shortcut_${item.href}`}
                    type="button"
                    onClick={() => jumpToQuickItem(item.href)}
                    className={isActivePath(pathname, item.href) ? "active" : ""}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="shell-topbar-actions">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              回到顶部
            </button>
            <button
              type="button"
              onClick={() => setThemeMode((prev) => (prev === "nebula" ? "aurora" : "nebula"))}
            >
              {themeMode === "nebula" ? "晨曦主题" : "星夜主题"}
            </button>
          </div>
        </div>
        <div className="main-content">{children}</div>
        {showBackTop ? (
          <button
            type="button"
            className="back-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            回到顶部
          </button>
        ) : null}
      </main>
    </div>
  );
}
