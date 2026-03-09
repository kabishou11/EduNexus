/**
 * 知识宝库模板系统
 * 提供各种预设模板和自定义模板功能
 */

export type TemplateCategory = "note" | "study" | "work" | "code" | "custom";

export type NoteTemplate = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  content: string;
  tags: string[];
};

/**
 * 预设模板列表
 */
export const PRESET_TEMPLATES: NoteTemplate[] = [
  {
    id: "cornell",
    name: "康奈尔笔记法",
    description: "经典的康奈尔笔记法，分为线索栏、笔记栏和总结栏",
    category: "note",
    icon: "📝",
    content: `# {{title}}

## 📌 线索栏（关键词/问题）

-

## 📖 笔记栏（详细内容）



## 💡 总结栏

`,
    tags: ["笔记", "学习"],
  },
  {
    id: "mindmap",
    name: "思维导图笔记",
    description: "树状结构的思维导图笔记模板",
    category: "note",
    icon: "🧠",
    content: `# {{title}}

## 🎯 中心主题



## 🌳 主要分支

### 分支 1


### 分支 2


### 分支 3


## 🔗 关联与联系

`,
    tags: ["思维导图", "笔记"],
  },
  {
    id: "reading",
    name: "读书笔记",
    description: "系统化的读书笔记模板",
    category: "study",
    icon: "📚",
    content: `# {{title}}

## 📖 基本信息

- **书名**：
- **作者**：
- **出版社**：
- **阅读日期**：{{date}}

## 🎯 阅读目的



## 📝 核心内容

### 主要观点


### 重要概念


### 精彩片段


## 💭 个人思考



## ⭐ 评分与推荐

- **评分**：⭐⭐⭐⭐⭐
- **推荐理由**：

#读书笔记 #学习`,
    tags: ["读书", "学习"],
  },
  {
    id: "meeting",
    name: "会议记录",
    description: "结构化的会议记录模板",
    category: "work",
    icon: "📋",
    content: `# {{title}}

## 📅 会议信息

- **时间**：{{date}}
- **地点**：
- **参与人员**：
- **主持人**：

## 🎯 会议议题



## 📝 讨论内容

### 议题 1


### 议题 2


## ✅ 决议事项

- [ ]
- [ ]

## 📌 待办事项

- [ ] 任务 1 - 负责人：XXX - 截止日期：
- [ ] 任务 2 - 负责人：XXX - 截止日期：

## 📎 附件与参考

#会议记录 #工作`,
    tags: ["会议", "工作"],
  },
  {
    id: "learning-log",
    name: "学习日志",
    description: "记录每日学习进度和收获",
    category: "study",
    icon: "📖",
    content: `# {{title}}

## 📅 日期

{{date}}

## 🎯 今日学习目标

- [ ]
- [ ]

## 📚 学习内容

### 主题 1


### 主题 2


## 💡 重要收获



## 🤔 遇到的问题



## 📝 待深入学习

-

## ⏰ 学习时长

约 X 小时

#学习日志 #学习`,
    tags: ["学习", "日志"],
  },
  {
    id: "code-note",
    name: "代码笔记",
    description: "记录代码片段和技术要点",
    category: "code",
    icon: "💻",
    content: `# {{title}}

## 🎯 问题描述



## 💡 解决方案

\`\`\`javascript
// 代码示例

\`\`\`

## 📝 关键要点

-

## 🔗 相关资源

-

## ⚠️ 注意事项



#代码 #技术`,
    tags: ["代码", "技术"],
  },
  {
    id: "project-plan",
    name: "项目规划",
    description: "项目规划和管理模板",
    category: "work",
    icon: "🎯",
    content: `# {{title}}

## 📋 项目概述



## 🎯 项目目标

-

## 📅 时间规划

- **开始日期**：
- **预计完成**：
- **关键里程碑**：

## 👥 团队成员

-

## 📊 任务分解

### 阶段 1


### 阶段 2


## 🚧 风险与挑战



## 📈 进度跟踪

- [ ] 任务 1
- [ ] 任务 2

#项目 #规划`,
    tags: ["项目", "规划"],
  },
  {
    id: "blank",
    name: "空白笔记",
    description: "从零开始创建笔记",
    category: "custom",
    icon: "📄",
    content: `# {{title}}

`,
    tags: [],
  },
];

/**
 * 根据分类获取模板
 */
export function getTemplatesByCategory(category: TemplateCategory): NoteTemplate[] {
  return PRESET_TEMPLATES.filter((t) => t.category === category);
}

/**
 * 根据 ID 获取模板
 */
export function getTemplateById(id: string): NoteTemplate | undefined {
  return PRESET_TEMPLATES.find((t) => t.id === id);
}

/**
 * 应用模板（替换变量）
 */
export function applyTemplate(
  template: NoteTemplate,
  variables: Record<string, string> = {}
): string {
  let content = template.content;

  // 默认变量
  const defaultVars = {
    title: "新笔记",
    date: new Date().toLocaleDateString("zh-CN"),
    time: new Date().toLocaleTimeString("zh-CN"),
    ...variables,
  };

  // 替换变量
  Object.entries(defaultVars).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return content;
}

/**
 * 模板分类信息
 */
export const TEMPLATE_CATEGORIES = [
  { id: "note", name: "笔记", icon: "📝" },
  { id: "study", name: "学习", icon: "📚" },
  { id: "work", name: "工作", icon: "💼" },
  { id: "code", name: "代码", icon: "💻" },
  { id: "custom", name: "自定义", icon: "✨" },
] as const;
