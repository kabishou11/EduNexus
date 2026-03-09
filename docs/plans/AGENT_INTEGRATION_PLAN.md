# EduNexus 全站 Agent 集成规划

## 概述

基于新实现的 React Agent 架构，规划各页面的智能化升级方案。

## 核心原则

1. **统一 Agent 能力**：所有页面共享同一套 Agent 工具
2. **场景化定制**：根据页面特点定制 Agent 行为
3. **渐进式增强**：保留现有功能，逐步添加智能能力
4. **用户体验优先**：AI 辅助而非替代用户操作

---

## 页面调整方案

### 1. 总览页面 (Dashboard) ✅ 已简化

**当前状态**：简洁的统计和快速导航

**建议增强**：
- [ ] 添加智能学习建议卡片
- [ ] 基于学习数据的个性化推荐
- [ ] 学习进度智能分析

**Agent 集成**：
```typescript
// 智能建议 API
POST /api/dashboard/suggestions
{
  "userId": "user_id",
  "recentActivity": [...],
  "learningGoals": [...]
}

// Agent 分析用户数据，返回：
// - 今日学习建议
// - 需要复习的知识点
// - 推荐的学习路径
```

---

### 2. 学习工作区 (Workspace) ✅ 已完成

**当前状态**：完整的 React Agent 集成

**已实现功能**：
- ✅ ReAct Agent 对话
- ✅ 7个智能工具
- ✅ 苏格拉底/直接教学双模式
- ✅ 思考过程可视化

**后续优化**：
- [ ] 添加对话历史持久化
- [ ] 支持多会话管理
- [ ] 集成语音输入
- [ ] 添加代码执行环境

---

### 3. 知识库 (KB) 🔄 需要增强

**当前状态**：基础的文档管理 + AI 助手浮窗

**建议增强**：
- [ ] **智能文档分析**：自动提取关键概念
- [ ] **双链笔记增强**：AI 推荐相关文档链接
- [ ] **自动标签生成**：基于内容智能打标签
- [ ] **文档摘要**：一键生成文档摘要
- [ ] **知识图谱集成**：可视化文档关系

**Agent 工具扩展**：
```typescript
// 新增工具
- analyze_document: 分析文档结构和内容
- suggest_links: 推荐相关文档链接
- generate_tags: 自动生成标签
- extract_concepts: 提取关键概念
```

**实现方案**：
```typescript
// apps/web/src/app/kb/page.tsx
// 添加智能功能按钮
<Button onClick={analyzeDocument}>
  <Brain className="h-4 w-4 mr-2" />
  智能分析
</Button>

// API 调用
POST /api/kb/analyze
{
  "documentId": "doc_id",
  "content": "文档内容",
  "action": "extract_concepts" | "suggest_links" | "generate_tags"
}
```

---

### 4. 知识图谱 (Graph) 🔄 需要增强

**当前状态**：基础的图谱可视化

**建议增强**：
- [ ] **智能节点推荐**：基于当前节点推荐相关概念
- [ ] **学习路径生成**：从节点 A 到节点 B 的最优学习路径
- [ ] **概念解释**：点击节点显示 AI 解释
- [ ] **关系推理**：AI 推断隐含的知识关系
- [ ] **图谱补全**：AI 建议缺失的节点和关系

**Agent 工具扩展**：
```typescript
// 新增工具
- recommend_related_nodes: 推荐相关节点
- find_learning_path: 查找学习路径
- explain_node: 解释节点概念
- infer_relationships: 推断关系
- suggest_missing_nodes: 建议缺失节点
```

**实现方案**：
```typescript
// apps/web/src/app/graph/page.tsx
// 右键菜单增强
<ContextMenu>
  <ContextMenuItem onClick={() => explainNode(nodeId)}>
    <Sparkles className="h-4 w-4 mr-2" />
    AI 解释
  </ContextMenuItem>
  <ContextMenuItem onClick={() => findPath(nodeId)}>
    <Map className="h-4 w-4 mr-2" />
    生成学习路径
  </ContextMenuItem>
</ContextMenu>

// API 调用
POST /api/graph/agent
{
  "action": "explain_node" | "find_path" | "recommend_nodes",
  "nodeId": "node_id",
  "targetNodeId": "target_id" // for path finding
}
```

---

### 5. 学习路径 (Path) 🔄 需要增强

**当前状态**：手动创建和管理学习路径

**建议增强**：
- [ ] **AI 生成路径**：基于目标自动生成学习路径
- [ ] **路径优化**：AI 分析并优化现有路径
- [ ] **进度预测**：预测完成时间和难度
- [ ] **个性化调整**：根据用户水平调整路径
- [ ] **资源推荐**：为每个节点推荐学习资源

**Agent 工具扩展**：
```typescript
// 新增工具
- generate_learning_path: 生成完整学习路径
- optimize_path: 优化路径结构
- estimate_duration: 预测学习时长
- recommend_resources: 推荐学习资源
- adjust_difficulty: 调整难度
```

**实现方案**：
```typescript
// apps/web/src/app/path/page.tsx
// AI 生成路径按钮
<Button onClick={generatePath}>
  <Sparkles className="h-4 w-4 mr-2" />
  AI 生成路径
</Button>

// 对话框
<Dialog>
  <DialogContent>
    <h3>AI 学习路径生成</h3>
    <Input placeholder="学习目标（如：掌握机器学习）" />
    <Select placeholder="当前水平">
      <SelectItem value="beginner">初学者</SelectItem>
      <SelectItem value="intermediate">中级</SelectItem>
      <SelectItem value="advanced">高级</SelectItem>
    </Select>
    <Button onClick={handleGenerate}>生成路径</Button>
  </DialogContent>
</Dialog>

// API 调用
POST /api/path/generate
{
  "goal": "掌握机器学习",
  "currentLevel": "beginner",
  "timeAvailable": "3个月",
  "preferences": ["视频", "实战项目"]
}
```

---

### 6. 教师工作台 (Teacher) 🔄 需要增强

**当前状态**：课程和作业管理

**建议增强**：
- [ ] **智能出题**：AI 生成考试题目
- [ ] **作业批改辅助**：AI 辅助批改主观题
- [ ] **学情分析**：分析学生学习情况
- [ ] **个性化建议**：为每个学生生成学习建议
- [ ] **教学内容生成**：AI 生成教学材料

**Agent 工具扩展**：
```typescript
// 新增工具
- generate_exam: 生成考试题目
- grade_assignment: 辅助批改作业
- analyze_student_performance: 分析学生表现
- generate_feedback: 生成个性化反馈
- create_teaching_material: 生成教学材料
```

**实现方案**：
```typescript
// apps/web/src/app/teacher/page.tsx
// 智能出题
<Button onClick={generateExam}>
  <Sparkles className="h-4 w-4 mr-2" />
  AI 出题
</Button>

// 批改辅助
<Button onClick={gradeWithAI}>
  <Brain className="h-4 w-4 mr-2" />
  AI 辅助批改
</Button>

// API 调用
POST /api/teacher/agent
{
  "action": "generate_exam",
  "subject": "线性代数",
  "difficulty": "medium",
  "questionCount": 10,
  "types": ["选择题", "填空题", "简答题"]
}
```

---

### 7. 配置中心 (Settings) ✅ 已完成模型配置

**当前状态**：模型配置、系统设置

**建议增强**：
- [ ] **智能配置建议**：AI 推荐最优配置
- [ ] **使用分析**：分析 AI 使用情况
- [ ] **成本优化**：建议如何降低 API 成本

**实现方案**：
```typescript
// apps/web/src/app/settings/page.tsx
// 智能配置建议
<Card>
  <CardHeader>
    <CardTitle>AI 配置建议</CardTitle>
  </CardHeader>
  <CardContent>
    <Alert>
      <Sparkles className="h-4 w-4" />
      <AlertDescription>
        基于你的使用模式，建议使用 Qwen3-8B 模型，
        可以节省 30% 的成本同时保持良好的效果。
      </AlertDescription>
    </Alert>
  </CardContent>
</Card>
```

---

## 统一 Agent 服务层

### 创建通用 Agent 服务

```typescript
// apps/web/src/lib/agent/agent-service.ts

export class AgentService {
  // 通用 Agent 调用
  static async call(params: {
    context: "workspace" | "kb" | "graph" | "path" | "teacher";
    action: string;
    data: any;
    config?: AgentConfig;
  }) {
    // 根据上下文选择合适的工具和提示词
    // 调用 Agent API
    // 返回结果
  }

  // 流式调用
  static async stream(params: any) {
    // 流式响应
  }

  // 批量调用
  static async batch(requests: any[]) {
    // 批量处理
  }
}
```

### 使用示例

```typescript
// 在任何页面中使用
import { AgentService } from "@/lib/agent/agent-service";

// 知识库页面
const result = await AgentService.call({
  context: "kb",
  action: "analyze_document",
  data: { documentId, content },
});

// 图谱页面
const path = await AgentService.call({
  context: "graph",
  action: "find_learning_path",
  data: { from: nodeA, to: nodeB },
});
```

---

## 实施优先级

### 第一阶段（立即实施）
1. ✅ 学习工作区 Agent 集成
2. ✅ 模型配置和测试
3. 🔄 创建统一 Agent 服务层
4. 🔄 知识库智能分析功能

### 第二阶段（1-2周）
1. 图谱智能增强
2. 学习路径 AI 生成
3. 知识库双链推荐

### 第三阶段（2-4周）
1. 教师工作台智能功能
2. 总览页面个性化建议
3. 全站 AI 能力整合

---

## 技术要求

### 前端
- 统一的 Agent 调用接口
- 加载状态和错误处理
- 流式响应支持
- 离线降级方案

### 后端
- Agent 工具模块化
- 上下文管理
- 缓存机制
- 性能监控

### 数据
- 对话历史持久化
- 用户偏好记录
- 学习数据分析
- 隐私保护

---

## 成功指标

1. **用户体验**
   - AI 响应时间 < 3秒
   - 准确率 > 85%
   - 用户满意度 > 4.0/5.0

2. **功能覆盖**
   - 7个核心页面全部集成 AI
   - 20+ 个智能工具
   - 支持 5+ 种学习场景

3. **技术指标**
   - API 成功率 > 99%
   - 平均 Token 消耗 < 1000/请求
   - 并发支持 > 100 用户

---

## 风险和挑战

1. **成本控制**：AI API 调用成本
   - 解决方案：缓存、批量处理、模型选择

2. **响应速度**：复杂推理耗时
   - 解决方案：流式响应、异步处理

3. **准确性**：AI 可能给出错误答案
   - 解决方案：人工审核、用户反馈、持续优化

4. **隐私安全**：用户数据保护
   - 解决方案：数据加密、权限控制、合规审查

---

## 下一步行动

1. [ ] 创建统一 Agent 服务层
2. [ ] 实现知识库智能分析
3. [ ] 添加图谱智能功能
4. [ ] 完善学习路径生成
5. [ ] 集成教师工作台 AI
6. [ ] 全面测试和优化
7. [ ] 编写用户文档
8. [ ] 收集用户反馈
