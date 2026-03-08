"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type QuickNavItem = {
  href: string;
  label: string;
  hint?: string;
};

type PageQuickNavProps = {
  title: string;
  items: QuickNavItem[];
};

export function PageQuickNav({ title, items }: PageQuickNavProps) {
  const storageKey = useMemo(
    () => `edunexus_page_quick_nav_collapsed_${encodeURIComponent(title)}`,
    [title]
  );
  const [collapsed, setCollapsed] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(storageKey) === "1");
    } catch {
      setCollapsed(false);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch {
      // ignore persistence failures
    }
  }, [collapsed, storageKey]);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const ids = items
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.replace(/^#/, ""))
      .filter((item) => item.length > 0);
    if (ids.length === 0) {
      return;
    }
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((item): item is HTMLElement => item instanceof HTMLElement);
    if (elements.length === 0) {
      return;
    }

    const updateFromHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveHref(hash);
      }
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topEntry = visibleEntries[0];
        if (!topEntry) {
          return;
        }
        const id = topEntry.target.getAttribute("id");
        if (!id) {
          return;
        }
        setActiveHref(`#${id}`);
      },
      { rootMargin: "-20% 0px -62% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    elements.forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredItems = normalizedKeyword
    ? items.filter((item) => {
        const text = `${item.label} ${item.hint ?? ""} ${item.href}`.toLowerCase();
        return text.includes(normalizedKeyword);
      })
    : items;
  const visibleItems = collapsed ? filteredItems.slice(0, 4) : filteredItems;

  return (
    <nav
      className={`page-quick-nav panel wide${collapsed ? " is-collapsed" : ""}`}
      aria-label={`${title} 页面快速导航`}
    >
      <header>
        <strong>{title}</strong>
        <div className="page-quick-nav-tools">
          <span>
            命中 {filteredItems.length}/{items.length} · 快速定位关键区块
          </span>
          {items.length > 4 ? (
            <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
              {collapsed ? "展开全部" : "折叠导航"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setKeyword("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            回到顶部
          </button>
        </div>
      </header>
      <div className="page-quick-nav-filter">
        <label className="page-quick-nav-search">
          <span>导航检索</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入关键词筛选导航项"
            aria-label={`${title}导航检索`}
          />
        </label>
        <button type="button" onClick={() => setKeyword("")} disabled={!keyword.trim()}>
          清空筛选
        </button>
      </div>
      <div className="page-quick-nav-row">
        {visibleItems.length === 0 ? (
          <p className="page-quick-nav-empty">当前筛选无结果，请调整关键词。</p>
        ) : (
          visibleItems.map((item) => {
            const active = item.href.startsWith("#")
              ? activeHref === item.href
              : item.href === "/"
                ? currentPath === "/"
                : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                {item.label}
                {item.hint ? <em>{item.hint}</em> : null}
              </Link>
            );
          })
        )}
      </div>
    </nav>
  );
}
