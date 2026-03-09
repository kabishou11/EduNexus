# 知识星图 API 集成指南

## 概述

本文档说明如何将知识星图与后端 API 集成，替换模拟数据为真实数据。

## 数据模型

### GraphNode

```typescript
interface GraphNode {
  id: string;                    // 唯一标识
  name: string;                  // 节点名称
  type: NodeType;                // 节点类型
  status: NodeStatus;            // 学习状态
  importance: number;            // 重要程度 (0-1)
  mastery: number;               // 掌握程度 (0-1)
  connections: number;           // 连接数量
  noteCount: number;             // 笔记数量
  practiceCount: number;         // 练习总数
  practiceCompleted: number;     // 完成的练习数
  lastReviewedAt?: Date;         // 最后复习时间
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
}

type NodeType = "concept" | "topic" | "resource" | "skill";
type NodeStatus = "unlearned" | "learning" | "mastered" | "review";
```

### GraphEdge

```typescript
interface GraphEdge {
  source: string | GraphNode;    // 源节点 ID
  target: string | GraphNode;    // 目标节点 ID
  type: EdgeType;                // 关系类型
  strength: number;              // 关系强度 (0-1)
}

type EdgeType = "prerequisite" | "related" | "contains" | "applies";
```

## API 端点

### 1. 获取图谱数据

**端点**: `GET /api/graph/view`

**查询参数**:
- `domain` (可选): 领域筛选
- `owner` (可选): 所有者筛选

**响应**:
```json
{
  "nodes": [
    {
      "id": "1",
      "name": "React 基础",
      "type": "concept",
      "status": "mastered",
      "importance": 0.9,
      "mastery": 0.85,
      "connections": 5,
      "noteCount": 3,
      "practiceCount": 5,
      "practiceCompleted": 5,
      "lastReviewedAt": "2026-03-04T00:00:00Z",
      "createdAt": "2026-01-09T00:00:00Z",
      "updatedAt": "2026-03-09T00:00:00Z"
    }
  ],
  "edges": [
    {
      "source": "1",
      "target": "2",
      "type": "contains",
      "strength": 0.9
    }
  ]
}
```

### 2. 获取节点详情

**端点**: `GET /api/graph/node/:nodeId`

**响应**:
```json
{
  "node": { /* GraphNode */ },
  "prerequisites": [ /* GraphNode[] */ ],
  "nextSteps": [ /* GraphNode[] */ ],
  "relatedNotes": [
    {
      "id": "note1",
      "title": "React 基础学习笔记",
      "excerpt": "这是笔记摘要..."
    }
  ],
  "relatedPractices": [
    {
      "id": "practice1",
      "title": "React 基础练习",
      "completed": true
    }
  ],
  "learningProgress": {
    "totalTime": 120,
    "lastStudied": "2026-03-09T00:00:00Z",
    "reviewCount": 3
  }
}
```

### 3. 更新节点状态

**端点**: `PATCH /api/graph/node/:nodeId`

**请求体**:
```json
{
  "status": "mastered",
  "mastery": 0.85,
  "practiceCompleted": 5
}
```

**响应**:
```json
{
  "success": true,
  "node": { /* 更新后的 GraphNode */ }
}
```

### 4. 创建节点

**端点**: `POST /api/graph/node`

**请求体**:
```json
{
  "name": "新知识点",
  "type": "concept",
  "importance": 0.7
}
```

**响应**:
```json
{
  "success": true,
  "node": { /* 新创建的 GraphNode */ }
}
```

### 5. 删除节点

**端点**: `DELETE /api/graph/node/:nodeId`

**响应**:
```json
{
  "success": true,
  "message": "节点已删除"
}
```

### 6. 创建关系

**端点**: `POST /api/graph/edge`

**请求体**:
```json
{
  "source": "1",
  "target": "2",
  "type": "prerequisite",
  "strength": 0.8
}
```

**响应**:
```json
{
  "success": true,
  "edge": { /* 新创建的 GraphEdge */ }
}
```

### 7. 删除关系

**端点**: `DELETE /api/graph/edge`

**请求体**:
```json
{
  "source": "1",
  "target": "2"
}
```

**响应**:
```json
{
  "success": true,
  "message": "关系已删除"
}
```

### 8. 获取学习路径推荐

**端点**: `GET /api/graph/recommendations/paths`

**查询参数**:
- `count` (可选): 返回路径数量，默认 3

**响应**:
```json
{
  "paths": [
    {
      "id": "path-1",
      "name": "从 React 基础到状态管理",
      "nodes": ["1", "3", "7"],
      "estimatedTime": 90,
      "difficulty": "medium",
      "reason": "这是最短的学习路径"
    }
  ]
}
```

### 9. 获取知识盲区

**端点**: `GET /api/graph/recommendations/gaps`

**响应**:
```json
{
  "gaps": [
    {
      "nodeId": "7",
      "reason": "孤立知识点，缺少关联",
      "priority": "medium",
      "suggestedActions": [
        "建立与其他知识点的联系",
        "添加相关笔记和资源"
      ]
    }
  ]
}
```

## 前端集成

### 1. 创建 API 客户端

```typescript
// lib/api/graph-api.ts

export class GraphAPI {
  private baseUrl = "/api/graph";

  async getGraphData(params?: {
    domain?: string;
    owner?: string;
  }): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${this.baseUrl}/view?${query}`);
    return response.json();
  }

  async getNodeDetail(nodeId: string): Promise<NodeDetail> {
    const response = await fetch(`${this.baseUrl}/node/${nodeId}`);
    return response.json();
  }

  async updateNode(
    nodeId: string,
    updates: Partial<GraphNode>
  ): Promise<GraphNode> {
    const response = await fetch(`${this.baseUrl}/node/${nodeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data.node;
  }

  async createNode(node: Omit<GraphNode, "id" | "createdAt" | "updatedAt">): Promise<GraphNode> {
    const response = await fetch(`${this.baseUrl}/node`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(node),
    });
    const data = await response.json();
    return data.node;
  }

  async deleteNode(nodeId: string): Promise<void> {
    await fetch(`${this.baseUrl}/node/${nodeId}`, {
      method: "DELETE",
    });
  }

  async createEdge(edge: Omit<GraphEdge, "id">): Promise<GraphEdge> {
    const response = await fetch(`${this.baseUrl}/edge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edge),
    });
    const data = await response.json();
    return data.edge;
  }

  async deleteEdge(source: string, target: string): Promise<void> {
    await fetch(`${this.baseUrl}/edge`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, target }),
    });
  }

  async getRecommendedPaths(count: number = 3): Promise<LearningPath[]> {
    const response = await fetch(
      `${this.baseUrl}/recommendations/paths?count=${count}`
    );
    const data = await response.json();
    return data.paths;
  }

  async getKnowledgeGaps(): Promise<KnowledgeGap[]> {
    const response = await fetch(`${this.baseUrl}/recommendations/gaps`);
    const data = await response.json();
    return data.gaps;
  }
}

export const graphAPI = new GraphAPI();
```

### 2. 更新页面组件

```typescript
// app/graph/enhanced-page.tsx

import { graphAPI } from "@/lib/api/graph-api";

export default function EnhancedGraphPage() {
  // ... 其他状态

  // 替换模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载图谱数据
        const data = await graphAPI.getGraphData();
        setGraphData(data);

        // 加载推荐路径
        const paths = await graphAPI.getRecommendedPaths(3);
        setRecommendedPaths(paths);
      } catch (error) {
        console.error("Failed to load graph data:", error);
      }
    };

    loadData();
  }, []);

  // 更新节点点击处理
  const handleNodeClick = useCallback(
    async (node: GraphNode) => {
      setSelectedNode(node);

      try {
        // 从 API 获取节点详情
        const detail = await graphAPI.getNodeDetail(node.id);
        setNodeDetail(detail);
      } catch (error) {
        console.error("Failed to load node detail:", error);
      }
    },
    []
  );

  // 更新节点编辑处理
  const handleEditNode = async (node: GraphNode) => {
    const newName = prompt("编辑节点名称:", node.name);
    if (newName && newName.trim()) {
      try {
        const updated = await graphAPI.updateNode(node.id, {
          name: newName.trim(),
        });

        // 更新本地状态
        setGraphData((prev) => ({
          ...prev,
          nodes: prev.nodes.map((n) =>
            n.id === node.id ? updated : n
          ),
        }));
      } catch (error) {
        console.error("Failed to update node:", error);
        alert("更新失败，请重试");
      }
    }
  };

  // 更新节点删除处理
  const handleDeleteNode = async (node: GraphNode) => {
    if (confirm(`确定要删除节点"${node.name}"吗?`)) {
      try {
        await graphAPI.deleteNode(node.id);

        // 更新本地状态
        setGraphData((prev) => ({
          nodes: prev.nodes.filter((n) => n.id !== node.id),
          edges: prev.edges.filter((e) => {
            const sourceId = typeof e.source === "string" ? e.source : e.source.id;
            const targetId = typeof e.target === "string" ? e.target : e.target.id;
            return sourceId !== node.id && targetId !== node.id;
          }),
        }));

        setSelectedNode(null);
        setNodeDetail(null);
      } catch (error) {
        console.error("Failed to delete node:", error);
        alert("删除失败，请重试");
      }
    }
  };

  // ... 其他代码
}
```

## 后端实现示例

### Node.js + Express

```typescript
// routes/graph.ts

import express from "express";
import { getGraphView, getNodeDetail, updateNode } from "../services/graph-service";

const router = express.Router();

// 获取图谱数据
router.get("/view", async (req, res) => {
  try {
    const { domain, owner } = req.query;
    const graph = await getGraphView({ domain, owner });
    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: "Failed to load graph" });
  }
});

// 获取节点详情
router.get("/node/:nodeId", async (req, res) => {
  try {
    const { nodeId } = req.params;
    const detail = await getNodeDetail(nodeId);
    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: "Failed to load node detail" });
  }
});

// 更新节点
router.patch("/node/:nodeId", async (req, res) => {
  try {
    const { nodeId } = req.params;
    const updates = req.body;
    const node = await updateNode(nodeId, updates);
    res.json({ success: true, node });
  } catch (error) {
    res.status(500).json({ error: "Failed to update node" });
  }
});

export default router;
```

## 数据同步策略

### 1. 实时同步

使用 WebSocket 实现实时数据同步：

```typescript
// lib/api/graph-websocket.ts

export class GraphWebSocket {
  private ws: WebSocket;

  connect(onUpdate: (data: any) => void) {
    this.ws = new WebSocket("ws://localhost:3000/graph");

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };
  }

  disconnect() {
    this.ws?.close();
  }
}
```

### 2. 定期轮询

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await graphAPI.getGraphData();
    setGraphData(data);
  }, 30000); // 每30秒刷新

  return () => clearInterval(interval);
}, []);
```

### 3. 乐观更新

```typescript
const handleUpdateNode = async (nodeId: string, updates: Partial<GraphNode>) => {
  // 立即更新 UI
  setGraphData((prev) => ({
    ...prev,
    nodes: prev.nodes.map((n) =>
      n.id === nodeId ? { ...n, ...updates } : n
    ),
  }));

  try {
    // 发送到服务器
    await graphAPI.updateNode(nodeId, updates);
  } catch (error) {
    // 失败时回滚
    const data = await graphAPI.getGraphData();
    setGraphData(data);
  }
};
```

## 性能优化

### 1. 数据缓存

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["graph"],
  queryFn: () => graphAPI.getGraphData(),
  staleTime: 5 * 60 * 1000, // 5分钟
});
```

### 2. 分页加载

```typescript
const loadMoreNodes = async (offset: number, limit: number) => {
  const response = await fetch(
    `/api/graph/view?offset=${offset}&limit=${limit}`
  );
  return response.json();
};
```

### 3. 增量更新

```typescript
const updateGraphIncremental = async (lastUpdateTime: Date) => {
  const response = await fetch(
    `/api/graph/updates?since=${lastUpdateTime.toISOString()}`
  );
  const updates = await response.json();

  // 合并更新
  setGraphData((prev) => mergeUpdates(prev, updates));
};
```

## 错误处理

```typescript
const handleAPIError = (error: Error) => {
  if (error.message.includes("401")) {
    // 未授权，跳转登录
    window.location.href = "/login";
  } else if (error.message.includes("404")) {
    // 资源不存在
    alert("请求的资源不存在");
  } else {
    // 其他错误
    console.error("API Error:", error);
    alert("操作失败，请重试");
  }
};
```

## 测试

### 单元测试

```typescript
import { graphAPI } from "@/lib/api/graph-api";

describe("GraphAPI", () => {
  it("should fetch graph data", async () => {
    const data = await graphAPI.getGraphData();
    expect(data.nodes).toBeDefined();
    expect(data.edges).toBeDefined();
  });

  it("should update node", async () => {
    const updated = await graphAPI.updateNode("1", { name: "New Name" });
    expect(updated.name).toBe("New Name");
  });
});
```

### 集成测试

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import EnhancedGraphPage from "./enhanced-page";

describe("EnhancedGraphPage", () => {
  it("should load and display graph", async () => {
    render(<EnhancedGraphPage />);

    await waitFor(() => {
      expect(screen.getByText("知识星图")).toBeInTheDocument();
    });
  });
});
```

## 部署注意事项

1. **环境变量**
   ```env
   NEXT_PUBLIC_API_URL=https://api.edunexus.com
   NEXT_PUBLIC_WS_URL=wss://api.edunexus.com
   ```

2. **CORS 配置**
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
   }));
   ```

3. **认证**
   ```typescript
   const token = localStorage.getItem("auth_token");
   fetch(url, {
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   ```

## 总结

通过以上步骤，你可以将知识星图与真实的后端 API 集成。记得：

1. 先实现基本的 CRUD 操作
2. 添加错误处理和加载状态
3. 实现数据缓存和优化
4. 添加实时同步（可选）
5. 编写测试确保稳定性

---

**版本**: 1.0.0
**更新**: 2026-03-09
