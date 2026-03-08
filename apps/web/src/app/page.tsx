import Link from "next/link";
import { GalaxyHero, GalaxySpotlight } from "@/components/galaxy-ui";
import { PageHeader } from "@/components/page-header";

const coreEntries = [
  {
    href: "/workspace",
    title: "学习工作区",
    description: "用分层引导完成推理过程，沉淀可复盘会话。",
    tag: "先思考后答案"
  },
  {
    href: "/graph",
    title: "知识图谱",
    description: "定位高风险关系链，并把批次直接推送到学习执行面。",
    tag: "风险链路联动"
  },
  {
    href: "/path",
    title: "学习路径",
    description: "基于图谱焦点生成可执行任务序列，并持续回写掌握度。",
    tag: "目标到执行闭环"
  }
];

const supportEntries = [
  {
    href: "/dashboard",
    title: "生态看板",
    description: "统一追踪学习增益、提示依赖和风险干预结果。",
    tag: "趋势与干预"
  },
  {
    href: "/kb",
    title: "本地知识库",
    description: "用双链与检索组织长期知识资产，形成个人学习语境。",
    tag: "轻量沉淀复用"
  },
  {
    href: "/teacher",
    title: "教师工作台",
    description: "围绕备课与课堂改进输出结构化教学方案。",
    tag: "教学协同"
  },
  {
    href: "/settings",
    title: "配置中心",
    description: "统一管理策略模板、导入审计与系统参数。",
    tag: "可控可回滚"
  }
];

export default function HomePage() {
  return (
    <section className="ecosystem-page">
      <PageHeader
        title="AI 教育生态平台"
        description="统一学习引导、知识沉淀、图谱分析与路径干预。全部能力围绕“先学会，再答题”构建。"
        tags={["纯 Web", "LangGraph", "ModelScope", "本地优先知识库"]}
        actions={
          <div className="page-head-cta">
            <Link href="/workspace">开始学习</Link>
            <Link href="/graph">查看图谱</Link>
          </div>
        }
      />

      <div className="panel-grid">
        <GalaxyHero
          badge="学习生态主入口"
          title="从“会做题”升级为“会学习、会迁移、会复盘”"
          description="工作区负责引导，图谱负责定位，路径负责执行，知识库负责沉淀。每次学习都会进入可检索、可回放、可复用的长期资产。"
          quote="同一套界面里完成“问题理解 -> 结构化思考 -> 证据沉淀 -> 路径回写”，避免碎片化跳转。"
          chips={["LangGraph 工作流", "ModelScope 模型接入", "本地优先沉淀", "Web 全链路"]}
          metrics={[
            { label: "核心工作台", value: "3", hint: "工作区 / 图谱 / 路径" },
            { label: "生态模块", value: "8", hint: "覆盖学习与教学协同" },
            { label: "上线形态", value: "Web", hint: "可直接部署到 Vercel" }
          ]}
          actions={
            <div className="page-head-cta">
              <Link href="/workspace">进入学习工作区</Link>
              <Link href="/path">查看学习路径</Link>
            </div>
          }
        />
      </div>

      <div className="panel-grid home-spotlight-grid">
        <article className="panel half">
          <GalaxySpotlight
            title="产品原则"
            description="不做拍照即答案；坚持过程引导、错因解释、关系迁移和知识沉淀，帮助用户建立长期学习能力。"
            status="已启用"
          />
        </article>
        <article className="panel half">
          <GalaxySpotlight
            title="工程状态"
            description="全站统一使用可复用导航、筛选、锚点与回放机制，减少页面学习成本。"
            status="持续优化"
          />
        </article>
      </div>

      <div className="panel-grid">
        <article className="panel wide home-section-panel">
          <header className="home-section-head">
            <strong>核心学习链路</strong>
            <span>按学习闭环顺序组织，建议从左到右逐步使用</span>
          </header>
          <div className="home-entry-grid">
            {coreEntries.map((item) => (
              <article key={item.href} className="home-entry-card">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href} className="panel-link-btn">
                  进入 {item.title}
                </Link>
              </article>
            ))}
          </div>
        </article>

        <article className="panel half home-section-panel">
          <header className="home-section-head">
            <strong>生态支撑模块</strong>
            <span>围绕教学、治理与知识管理提供配套能力</span>
          </header>
          <div className="home-entry-grid home-entry-grid-compact">
            {supportEntries.map((item) => (
              <article key={item.href} className="home-entry-card">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href} className="panel-link-btn">
                  进入 {item.title}
                </Link>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
