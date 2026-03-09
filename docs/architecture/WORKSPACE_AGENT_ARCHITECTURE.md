# 学习工作区 React Agent 架构文档

## 概述

学习工作区采用 **React Agent** 范式和 **LangGraph** 进行状态管理，提供智能化的学习辅助功能。

## 架构设计

### 1. ReAct (Reasoning + Acting) 模式

Agent 使用 ReAct 模式工作，包含以下步骤：

```
用户输入 → Thought (思考) → Action (行动) → Observation (观察) → Thought → ... → Final Answer
```

**示例流程**：
```
用户: "我想学习线性代数，但不知道从哪里开始"

Thought: 用户需要学习路径推荐，我应该先了解他的基础水平
Action: check_understanding("线性代数基础")
Observation: 用户对向量和矩阵有基本了解

Thought: 基于用户水平，我可以推荐合适的学习路径
Action: recommend_learning_path("线性代数", "beginner")
Observation: 返回了包含3个阶段的学习路径

Thought: 现在我可以给出完整的建议
Final Answer: 根据你的基础，我建议...
```

### 2. 工具系统

Agent 可以使用以下工具：

#### 2.1 搜索知识库 (search_knowledge_base)
- **用途**: 查找相关文档和笔记
- **参数**: query (搜索词), limit (结果数量)
- **示例**: 搜索"矩阵乘法"相关内容

#### 2.2 查询知识图谱 (query_knowledge_graph)
- **用途**: 获取概念之间的关系
- **参数**: concept (概念), depth (查询深度)
- **示例**: 查询"线性代数"的前置知识和应用

#### 2.3 生成练习题 (generate_exercise)
- **用途**: 根据知识点生成练习
- **参数**: topic (主题), difficulty (难度), count (数量)
- **示例**: 生成3道中等难度的矩阵题

#### 2.4 推荐学习路径 (recommend_learning_path)
- **用途**: 规划学习路线
- **参数**: currentTopic (当前主题), goal (学习目标)
- **示例**: 从基础到高级的完整路径

#### 2.5 解释概念 (explain_concept)
- **用途**: 用简单语言解释复杂概念
- **参数**: concept (概念), level (深度级别)
- **示例**: 用初学者能理解的方式解释"特征值"

#### 2.6 苏格拉底式提问 (socratic_question)
- **用途**: 生成引导性问题
- **参数**: userQuestion (用户问题), context (上下文)
- **示例**: 不直接给答案，而是引导思考

#### 2.7 检查理解程度 (check_understanding)
- **用途**: 评估学习效果
- **参数**: topic (主题), userResponse (用户回答)
- **示例**: 通过提问检查是否真正理解

### 3. 工作模式

#### 3.1 苏格拉底模式（默认）
- 通过提问引导学生思考
- 不直接给答案，提供提示和线索
- 鼓励自主探索和发现
- 适合深度学习和概念理解

#### 3.2 直接教学模式
- 直接解释概念和提供答案
- 提供详细步骤和示例
- 主动推荐学习资源
- 适合快速学习和知识获取

### 4. 状态管理

使用 LangGraph 管理对话状态：

```typescript
interface AgentState {
  messages: BaseMessage[];        // 对话历史
  currentTopic?: string;          // 当前学习主题
  userLevel?: string;             // 用户水平
  learningGoal?: string;          // 学习目标
  sessionContext: Record<string, any>; // 会话上下文
}
```

## API 接口

### 1. 标准对话 API

```bash
POST /api/workspace/agent/chat
Content-Type: application/json

{
  "message": "我想学习线性代数",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "config": {
    "socraticMode": true,
    "temperature": 0.7,
    "maxIterations": 5
  }
}
```

**响应**:
```json
{
  "success": true,
  "response": "让我们一起探索线性代数...",
  "thinking": "**思考**: 用户想学习线性代数...\n**工具**: recommend_learning_path\n**结果**: ...",
  "steps": [...],
  "timestamp": "2026-03-09T..."
}
```

### 2. 流式对话 API

```bash
POST /api/workspace/agent/stream
Content-Type: application/json

{
  "message": "解释一下特征值",
  "history": [],
  "config": { "socraticMode": false }
}
```

**响应** (Server-Sent Events):
```
{"type":"thinking","content":"用户想了解特征值..."}
{"type":"action","content":"使用工具: explain_concept"}
{"type":"observation","content":"..."}
{"type":"output","content":"特征值是..."}
```

## 使用示例

### 示例 1: 学习路径规划

```typescript
// 用户输入
"我想学习机器学习，但数学基础不太好"

// Agent 工作流程
1. Thought: 需要评估数学基础
2. Action: check_understanding("数学基础")
3. Observation: 用户对微积分和线性代数了解有限
4. Thought: 应该先补充数学基础
5. Action: recommend_learning_path("机器学习", "需要补充数学")
6. Final Answer: "我建议你先从以下数学基础开始..."
```

### 示例 2: 概念理解

```typescript
// 用户输入
"什么是梯度下降？"

// 苏格拉底模式
Agent: "在回答之前，你能先告诉我你对'梯度'这个概念的理解吗？"
User: "梯度就是斜率吧？"
Agent: "很好的开始！那你觉得'下降'在这里是什么意思呢？"
User: "往下走？"
Agent: "对！那如果我们想找到一个函数的最小值，你觉得应该往哪个方向走？"
// ... 引导式对话继续
```

### 示例 3: 练习生成

```typescript
// 用户输入
"我想练习一下矩阵乘法"

// Agent 工作流程
1. Action: generate_exercise("矩阵乘法", "medium", 3)
2. Observation: 生成了3道题目
3. Final Answer: "这里有3道练习题..."
```

## 配置选项

### Agent 配置

```typescript
interface AgentConfig {
  modelName?: string;        // 模型名称，默认 Qwen/Qwen3-8B
  temperature?: number;      // 温度，默认 0.7
  maxIterations?: number;    // 最大迭代次数，默认 5
  socraticMode?: boolean;    // 苏格拉底模式，默认 true
}
```

### 环境变量

```bash
# ModelScope 配置
MODELSCOPE_API_KEY=your_api_key
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
MODELSCOPE_CHAT_MODEL=Qwen/Qwen3-8B
```

## 扩展开发

### 添加新工具

```typescript
// 1. 在 tools.ts 中定义工具
export const myNewTool = new DynamicStructuredTool({
  name: "my_new_tool",
  description: "工具描述",
  schema: z.object({
    param: z.string().describe("参数描述"),
  }),
  func: async ({ param }) => {
    // 工具逻辑
    return JSON.stringify(result);
  },
});

// 2. 添加到工具列表
export function getAllTools() {
  return [
    // ... 现有工具
    myNewTool,
  ];
}
```

### 自定义 Agent 行为

```typescript
// 修改 learning-agent.ts 中的提示词
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `你的自定义系统提示词...`,
  ],
  // ...
]);
```

## 性能优化

1. **缓存工具结果**: 对于相同的查询，缓存结果避免重复计算
2. **限制迭代次数**: 设置合理的 maxIterations 避免无限循环
3. **异步工具调用**: 工具支持异步操作，提高响应速度
4. **流式响应**: 使用流式 API 提供更好的用户体验

## 故障排除

### 问题 1: Agent 响应慢
**解决方案**:
- 减少 maxIterations
- 使用更小的模型
- 优化工具执行速度

### 问题 2: Agent 陷入循环
**解决方案**:
- 检查工具返回格式
- 优化提示词
- 增加终止条件

### 问题 3: 工具调用失败
**解决方案**:
- 检查工具参数验证
- 添加错误处理
- 提供降级方案

## 最佳实践

1. **清晰的工具描述**: 让 Agent 知道何时使用哪个工具
2. **结构化的工具输出**: 使用 JSON 格式返回结果
3. **合理的提示词**: 明确 Agent 的角色和行为准则
4. **错误处理**: 所有工具都应该有错误处理
5. **日志记录**: 记录 Agent 的思考过程便于调试

## 未来规划

- [ ] 集成更多学习工具
- [ ] 支持多模态输入（图片、语音）
- [ ] 个性化学习路径
- [ ] 学习进度追踪
- [ ] 协作学习功能
- [ ] 知识图谱可视化
- [ ] 自适应难度调整
