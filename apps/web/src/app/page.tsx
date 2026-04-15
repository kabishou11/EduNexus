"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GalaxyHero, GalaxySpotlight } from "@/components/galaxy-ui";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Network,
  Route,
  BarChart3,
  Database,
  Settings,
  ArrowRight,
  Target,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Compass,
  CheckCircle2,
  Layers3
} from "lucide-react";

const coreEntries = [
  {
    href: "/workspace",
    title: "学习工作区",
    description: "先把当前问题讲清、拆解并推进成可复盘的学习对话。",
    tag: "第 1 步 · 开始学习",
    icon: BookOpen
  },
  {
    href: "/graph",
    title: "知识星图",
    description: "查看概念关系、风险链路与薄弱点，找到下一步该补哪里。",
    tag: "第 2 步 · 定位薄弱点",
    icon: Network
  },
  {
    href: "/path",
    title: "成长地图",
    description: "把目标拆成连续任务，并持续回写进度与掌握情况。",
    tag: "第 3 步 · 持续推进",
    icon: Route
  }
];

const supportEntries = [
  {
    href: "/dashboard",
    title: "生态看板",
    description: "统一追踪学习增益、提示依赖和风险干预结果。",
    tag: "趋势与干预",
    icon: BarChart3
  },
  {
    href: "/kb",
    title: "知识宝库",
    description: "用双链与检索组织长期知识资产，形成个人学习语境。",
    tag: "轻量沉淀复用",
    icon: Database
  },
  {
    href: "/settings",
    title: "配置中心",
    description: "统一管理策略模板、导入审计与系统参数。",
    tag: "可控可回滚",
    icon: Settings
  }
];

const recommendedFlow = [
  {
    title: "先进入工作区",
    description: "从一个具体问题开始，先形成思考路径而不是直接找答案。",
    icon: Compass
  },
  {
    title: "再看知识星图",
    description: "定位关联概念、风险链路和遗漏知识点，决定下一步补强方向。",
    icon: Layers3
  },
  {
    title: "最后放进成长地图",
    description: "把学习目标变成连续任务，持续追踪掌握度与完成进度。",
    icon: CheckCircle2
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

export default function HomePage() {
  return (
    <motion.section
      className="page-container space-y-10 md:space-y-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <PageHeader
          title="AI 教育生态平台"
          description="把问题引导、知识定位、路径推进和长期沉淀放进同一套学习闭环，帮助你先学会，再答题。"
          tags={["从问题出发", "定位薄弱点", "沉淀长期资产"]}
          actions={
            <>
              <Link href="/workspace" className="w-full sm:w-auto">
                <Button size="lg" className="btn-primary group w-full sm:w-auto">
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  进入学习工作区
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/path" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                  <Route className="mr-2 h-4 w-4" />
                  查看成长地图
                </Button>
              </Link>
            </>
          }
        />
      </motion.div>

      <motion.div className="panel-grid" variants={itemVariants}>
        <GalaxyHero
          badge="推荐起点"
          title="先在工作区把问题学明白，再用星图定位薄弱点，最后交给成长地图持续推进。"
          description="工作区负责引导思考，知识星图负责发现关系与风险，成长地图负责把目标拆成连续行动，知识宝库负责保存长期语境。"
          quote="同一套界面里完成问题理解、结构化思考、证据沉淀与路径回写，减少碎片化切换。"
          chips={["LangGraph 工作流", "ModelScope 模型接入", "本地优先沉淀", "Web 全链路"]}
          metrics={[
            { label: "核心工作台", value: "3", hint: "工作区 / 星图 / 地图" },
            { label: "推荐顺序", value: "1→2→3", hint: "引导 → 定位 → 推进" },
            { label: "长期资产", value: "持续沉淀", hint: "会话 / 图谱 / 路径 / 知识" }
          ]}
          actions={
            <>
              <Link href="/workspace" className="w-full sm:w-auto">
                <Button size="lg" className="btn-primary group w-full sm:w-auto">
                  <BookOpen className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  从工作区开始
                </Button>
              </Link>
              <Link href="/graph" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                  <Network className="mr-2 h-4 w-4" />
                  再看知识星图
                </Button>
              </Link>
            </>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="glass-card border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">推荐使用顺序</CardTitle>
                <CardDescription>如果你是第一次使用，按这个顺序最容易形成完整学习闭环。</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recommendedFlow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="glass-card h-full border-border/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">步骤 {index + 1}</span>
                      </div>
                      <Badge variant="outline" className="feature-chip">建议</Badge>
                    </div>
                    <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="panel-grid" variants={itemVariants}>
        <div className="col-span-12 md:col-span-6">
          <GalaxySpotlight
            title="为什么这样学"
            description="不是把答案更快给你，而是先把问题拆开、解释错因、建立关系，再把结果沉淀成可复用资产。"
            status="学习导向"
            icon={<Target className="w-5 h-5" />}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <GalaxySpotlight
            title="建议从哪里开始"
            description="如果你只有一个当前问题，就先进入学习工作区；如果你已经知道自己的目标，再进入成长地图安排连续任务。"
            status="上手更快"
            icon={<Lightbulb className="w-5 h-5" />}
          />
        </div>
      </motion.div>

      <motion.div className="space-y-6" variants={itemVariants}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">核心学习链路</h2>
              <p className="text-muted-foreground">围绕一条清晰主路径组织，建议按顺序逐步使用。</p>
            </div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {coreEntries.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Card className="card-hover group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <motion.div
                        className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <Badge variant="outline" className="feature-chip shrink-0">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href}>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10">
                        进入 {item.title}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div className="space-y-6" variants={itemVariants}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/50">
              <BarChart3 className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">生态支撑模块</h2>
              <p className="text-muted-foreground">围绕教学、治理与知识管理提供配套能力。</p>
            </div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {supportEntries.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Card className="card-hover group h-full">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <motion.div
                        className="p-2 rounded-lg bg-secondary/50 text-secondary-foreground"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      <Badge variant="secondary" className="text-xs">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs group-hover:bg-secondary/70"
                      >
                        查看详情
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
