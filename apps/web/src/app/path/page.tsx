import { Suspense } from "react";
import { PathDemo } from "@/components/path-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";

const PATH_QUICK_NAV_ITEMS = [
  { href: "#path_focus_panel", label: "焦点联动", hint: "批量队列与桥接" },
  { href: "#path_goal_panel", label: "目标与生成", hint: "生成与重排" },
  { href: "#path_plan_panel", label: "计划任务", hint: "执行与回写" },
  { href: "#path_error_panel", label: "状态反馈", hint: "异常定位" }
] as const;

export default function PathPage() {
  return (
    <section className="ecosystem-page">
      <PageHeader
        title="学习路径"
        description="把目标、风险与掌握度统一成可执行任务序列，并在执行后持续回写图谱。"
        tags={["7 日计划", "动态重排", "图谱回写", "批次队列"]}
      />
      <div className="panel-grid">
        <PageQuickNav title="路径页快速导航" items={[...PATH_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <article className="panel wide">
          <h3>路径规划与执行</h3>
          <Suspense fallback={<p className="muted">正在加载路径模块...</p>}>
            <PathDemo />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
