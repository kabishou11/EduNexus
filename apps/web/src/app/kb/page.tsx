import { Suspense } from "react";
import { KbDemo } from "@/components/kb-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";

const KB_QUICK_NAV_ITEMS = [
  { href: "#kb_search_panel", label: "检索控制", hint: "关键词与过滤" },
  { href: "#kb_doc_panel", label: "文档阅读", hint: "双链与摘录" },
  { href: "#kb_graph_panel", label: "关系图谱", hint: "反链图与热度" },
  { href: "#kb_index_panel", label: "索引摘要", hint: "重建与统计" }
] as const;

export default function KbPage() {
  return (
    <section className="ecosystem-page">
      <PageHeader
        title="本地知识库"
        description="以 Markdown 双链为核心组织个人知识资产，支持检索、关系导航与上下文引用。"
        tags={["Local-first", "双链关系", "轻量检索", "时间脉络"]}
      />
      <div className="panel-grid">
        <PageQuickNav title="知识库快速导航" items={[...KB_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <article className="panel wide">
          <h3>知识检索与文档阅读</h3>
          <Suspense fallback={<div className="result-box">正在加载知识库...</div>}>
            <KbDemo />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
