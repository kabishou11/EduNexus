"use client";

import { useEffect, useMemo, useState } from "react";

type SectionAnchorItem = {
  id: string;
  label: string;
};

type SectionAnchorNavProps = {
  title: string;
  storageKey: string;
  items: SectionAnchorItem[];
};

export function SectionAnchorNav({ title, storageKey, items }: SectionAnchorNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [collapsed, setCollapsed] = useState(false);
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");

  const normalizedItems = useMemo(
    () => items.filter((item) => item.id.trim().length > 0),
    [items]
  );

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(`edunexus_anchor_nav_${storageKey}`) === "1");
    } catch {
      setCollapsed(false);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        `edunexus_anchor_nav_${storageKey}`,
        collapsed ? "1" : "0"
      );
    } catch {
      // ignore persistence failures
    }
  }, [collapsed, storageKey]);

  useEffect(() => {
    if (normalizedItems.length === 0) {
      return;
    }
    const updateAvailableIds = () => {
      const hits = normalizedItems
        .map((item) => item.id)
        .filter((id) => document.getElementById(id));
      setAvailableIds(hits);
    };
    updateAvailableIds();
    const mutationObserver = new MutationObserver(updateAvailableIds);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => mutationObserver.disconnect();
  }, [normalizedItems]);

  useEffect(() => {
    if (availableIds.length === 0) {
      return;
    }
    const elements = availableIds
      .map((id) => document.getElementById(id))
      .filter((item): item is HTMLElement => item instanceof HTMLElement);
    if (elements.length === 0) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const hit = visible[0];
        if (!hit) {
          return;
        }
        const id = hit.target.getAttribute("id");
        if (id) {
          setActiveId(id);
        }
      },
      { rootMargin: "-18% 0px -64% 0px", threshold: [0, 0.15, 0.5, 1] }
    );
    elements.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [availableIds]);

  if (normalizedItems.length === 0) {
    return null;
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredItems = normalizedKeyword
    ? normalizedItems.filter((item) =>
        `${item.label} ${item.id}`.toLowerCase().includes(normalizedKeyword)
      )
    : normalizedItems;
  const visibleItems = collapsed ? filteredItems.slice(0, 4) : filteredItems;
  const availableIdSet = new Set(availableIds);

  return (
    <nav className="demo-anchor-nav" aria-label={`${title}区块导航`}>
      <div className="demo-anchor-head">
        <strong>{title}</strong>
        <div className="demo-anchor-tools">
          <span>
            命中 {filteredItems.length}/{normalizedItems.length}
          </span>
          {normalizedItems.length > 4 ? (
            <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
              {collapsed ? "展开全部" : "折叠导航"}
            </button>
          ) : null}
          <button type="button" onClick={() => setKeyword("")} disabled={!keyword.trim()}>
            清空筛选
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            回到顶部
          </button>
        </div>
      </div>
      <div className="demo-anchor-filter">
        <label>
          <span>分区检索</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入区块关键词"
            aria-label={`${title}分区检索`}
          />
        </label>
      </div>
      <div className="demo-anchor-row">
        {visibleItems.length === 0 ? (
          <p className="demo-anchor-empty">当前筛选无结果，请调整关键词。</p>
        ) : (
          visibleItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`demo-anchor-chip ${activeId === item.id ? "active" : ""} ${
                availableIdSet.has(item.id) ? "" : "disabled"
              }`}
              disabled={!availableIdSet.has(item.id)}
              onClick={() => {
                const element = document.getElementById(item.id);
                if (!element) {
                  return;
                }
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(item.id);
              }}
            >
              {item.label}
            </button>
          ))
        )}
      </div>
    </nav>
  );
}
