# 学习工作区 Agent 快速开始

## 立即体验

### 1. 确保环境配置

```bash
# .env.local
NEXT_PUBLIC_AI_PROVIDER=modelscope
MODELSCOPE_API_KEY=your_api_key
MODELSCOPE_CHAT_MODEL=Qwen/Qwen3-8B
```

### 2. 启动项目

```bash
pnpm dev
```

### 3. 访问工作区

打开浏览器访问: `http://localhost:3000/workspace`

## 使用场景

### 场景 1: 学习新知识

**用户**: "我想学习机器学习，但不知道从哪里开始"

**Agent 工作流程**:
1. 🤔 评估用户基础水平
2. 🔍 查询知识图谱找到前置知识
3. 📋 生成个性化学习路径
4. 💡 推荐相关资源

**预期输出**:
```
让我先了解一下你的基础。你对以下内容熟悉吗？
- 线性代数（矩阵、向量）
- 微积分（导数、梯度）
- 概率论（概率分布、贝叶斯）

[用户回答后]

很好！基于你的基础，我建议按以下路径学习：

📚 第一阶段（1-2周）：数学基础补充
- 复习线性代数中的特征值和特征向量
- 学习梯度和偏导数
- 资源：[MIT 线性代数公开课]

📚 第二阶段（2-3周）：机器学习基础
- 理解监督学习和无监督学习
- 学习线性回归和逻辑回归
- 资源：[Andrew Ng 机器学习课程]

📚 第三阶段（3-4周）：实战项目
- 完成 Kaggle 入门项目
- 构建自己的预测模型
```

### 场景 2: 概念理解（苏格拉底模式）

**用户**: "什么是梯度下降？"

**Agent（苏格拉底模式）**:
```
在解释梯度下降之前，让我先问你几个问题：

1️⃣ 你知道什么是"梯度"吗？
   [用户: 梯度就是斜率吧？]

很好的理解！梯度确实和斜率有关。

2️⃣ 如果你站在一座山上，想要下山，你会怎么走？
   [用户: 往最陡的地方往下走]

完全正确！这就是梯度下降的核心思想。

3️⃣ 那如果我们把"山"想象成一个函数的图像，"下山"就是...？
   [用户: 找到函数的最小值？]

太棒了！你已经理解了梯度下降的本质：
- 梯度告诉我们哪个方向最陡
- 下降意味着我们沿着这个方向往下走
- 目标是找到函数的最小值

现在你能用自己的话总结一下梯度下降吗？
```

### 场景 3: 练习生成

**用户**: "我想练习一下矩阵乘法"

**Agent**:
```
好的！我为你生成了3道练习题，难度逐渐递增：

📝 练习 1（简单）
计算以下矩阵乘法：
A = [1 2]    B = [5]
    [3 4]        [6]

💡 提示：结果矩阵的维度是 2×1

📝 练习 2（中等）
给定矩阵 A (3×2) 和 B (2×4)，计算 AB
A = [1 2]    B = [1 2 3 4]
    [3 4]        [5 6 7 8]
    [5 6]

💡 提示：先确定结果矩阵的维度

📝 练习 3（困难）
证明矩阵乘法的结合律：(AB)C = A(BC)
使用具体的 2×2 矩阵进行验证

完成后告诉我，我会检查你的答案并给出反馈！
```

### 场景 4: 知识关联

**用户**: "特征值和特征向量有什么用？"

**Agent**:
```
让我查询一下知识图谱...

🔍 查询结果：

📊 特征值/特征向量的应用场景：

1️⃣ 主成分分析 (PCA)
   - 降维技术
   - 数据可视化
   - 特征提取

2️⃣ 图像压缩
   - SVD 分解
   - 保留主要信息
   - 减少存储空间

3️⃣ 推荐系统
   - 协同过滤
   - 矩阵分解
   - 用户-物品关系

4️⃣ 网页排名 (PageRank)
   - Google 搜索算法
   - 图的中心性分析

🔗 相关概念：
- 矩阵对角化 → 简化计算
- 奇异值分解 (SVD) → 更通用的分解
- 谱聚类 → 图论应用

你对哪个应用场景最感兴趣？我可以详细讲解。
```

## API 调用示例

### JavaScript/TypeScript

```typescript
// 标准调用
async function chat(message: string, history: any[] = []) {
  const response = await fetch('/api/workspace/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      config: {
        socraticMode: true,
        temperature: 0.7,
        maxIterations: 5
      }
    })
  });

  const data = await response.json();
  console.log('Response:', data.response);
  console.log('Thinking:', data.thinking);
  return data;
}

// 流式调用
async function streamChat(message: string) {
  const response = await fetch('/api/workspace/agent/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: [] })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      const data = JSON.parse(line);
      console.log(`[${data.type}]`, data.content);
    }
  }
}
```

### Python

```python
import requests
import json

def chat(message, history=[]):
    response = requests.post(
        'http://localhost:3000/api/workspace/agent/chat',
        json={
            'message': message,
            'history': history,
            'config': {
                'socraticMode': True,
                'temperature': 0.7
            }
        }
    )
    return response.json()

# 使用示例
result = chat("我想学习深度学习")
print(result['response'])
```

### cURL

```bash
# 标准调用
curl -X POST http://localhost:3000/api/workspace/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "解释一下反向传播",
    "history": [],
    "config": { "socraticMode": false }
  }'

# 流式调用
curl -X POST http://localhost:3000/api/workspace/agent/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "什么是卷积神经网络？"}' \
  --no-buffer
```

## 配置选项

### Agent 配置

```typescript
{
  socraticMode: boolean;      // 苏格拉底模式，默认 true
  temperature: number;        // 温度 0-2，默认 0.7
  maxIterations: number;      // 最大迭代次数，默认 5
  modelName?: string;         // 模型名称
}
```

### 推荐配置

**深度学习场景**（需要引导思考）:
```json
{
  "socraticMode": true,
  "temperature": 0.7,
  "maxIterations": 5
}
```

**快速答疑场景**（直接给答案）:
```json
{
  "socraticMode": false,
  "temperature": 0.3,
  "maxIterations": 3
}
```

**创意探索场景**（开放式讨论）:
```json
{
  "socraticMode": true,
  "temperature": 0.9,
  "maxIterations": 7
}
```

## 常见问题

### Q: Agent 响应太慢怎么办？
A:
1. 减少 maxIterations
2. 使用更小的模型（Qwen3-4B）
3. 关闭苏格拉底模式
4. 使用流式 API

### Q: 如何切换工作模式？
A: 在配置中设置 `socraticMode: false` 切换到直接教学模式

### Q: 可以添加自定义工具吗？
A: 可以！参考 `apps/web/src/lib/agent/tools.ts` 添加新工具

### Q: 如何保存对话历史？
A: 将每轮对话的消息添加到 history 数组中传递给 API

## 下一步

- 📖 阅读完整架构文档: `WORKSPACE_AGENT_ARCHITECTURE.md`
- 🔧 自定义工具: 参考工具开发指南
- 🎨 集成到前端: 更新 workspace 页面
- 📊 添加数据分析: 跟踪学习进度

## 反馈和建议

如有问题或建议，请提交 Issue 或 PR！
