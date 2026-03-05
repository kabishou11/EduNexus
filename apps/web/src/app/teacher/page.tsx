import { TeacherPlanDemo } from "@/components/teacher-plan-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";

const TEACHER_QUICK_NAV_ITEMS = [
  { href: "#teacher_input_panel", label: "输入配置", hint: "主题与难度" },
  { href: "#teacher_template_panel", label: "薄弱点模板", hint: "模板刷新与套用" },
  { href: "#teacher_result_panel", label: "教案结果", hint: "目标流程与作业" },
  { href: "#teacher_error_panel", label: "状态反馈", hint: "错误提示" }
] as const;

export default function TeacherPage() {
  return (
    <section className="ecosystem-page">
      <PageHeader
        title="教师工作台"
        description="围绕教学准备与课堂改进生成结构化方案，减少重复整理时间。"
        tags={["备课生成", "结构化教案", "班级薄弱点", "可沉淀输出"]}
      />
      <div className="panel-grid">
        <PageQuickNav title="教师工作台快速导航" items={[...TEACHER_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <article className="panel wide">
          <h3>教学方案生成</h3>
          <TeacherPlanDemo />
        </article>
      </div>
    </section>
  );
}
