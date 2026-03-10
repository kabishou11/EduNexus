# EduNexus 协作编辑系统实现文档

## 概述

协作编辑系统是 EduNexus 的核心功能之一，支持多人实时协作编辑文档和代码，提供版本控制、权限管理、实时聊天等功能。

## 系统架构

### 技术栈
- **前端**: React, Next.js, Monaco Editor
- **状态管理**: React Hooks, Zustand (可选)
- **实时通信**: WebSocket / Server-Sent Events (模拟)
- **冲突解决**: Operational Transformation (简化版)
- **存储**: IndexedDB (客户端), JSON (服务端)

### 核心模块

```
apps/web/src/
├── app/
│   ├── api/collab/
│   │   ├── session/route.ts      # 会话管理 API
│   │   ├── chat/route.ts         # 聊天 API
│   │   └── version/route.ts      # 版本管理 API
│   └── collab/
│       ├── page.tsx              # 会话列表页
│       └── [sessionId]/page.tsx  # 协作编辑器页
├── components/collab/
│   ├── collab-editor.tsx         # 协作编辑器组件
│   ├── online-users.tsx          # 在线用户列表
│   ├── session-chat.tsx          # 会话聊天
│   ├── version-history.tsx       # 版本历史
│   └── share-dialog.tsx          # 分享对话框
└── lib/collab/
    ├── collab-types.ts           # 类型定义
    ├── collab-storage.ts         # 数据存储
    ├── collab-client.ts          # 协作客户端
    ├── sync-engine.ts            # 同步引擎
    ├── conflict-resolver.ts      # 冲突解决
    └── version-manager.ts        # 版本管理
```

## 核心功能

### 1. 实时协作编辑

#### 编辑器集成
使用 Monaco Editor 提供代码编辑功能：

```typescript
import Editor from "@monaco-editor/react";

<Editor
  height="100%"
  language={language}
  value={content}
  onMount={handleEditorDidMount}
  options={{
    readOnly,
    minimap: { enabled: true },
    fontSize: 14,
  }}
/>
```

#### 操作同步
每次编辑操作都会生成一个 `CollabOperation`：

```typescript
type CollabOperation = {
  type: "insert" | "delete" | "replace";
  position: { line: number; column: number };
  content?: string;
  length?: number;
  userId: string;
  timestamp: string;
};
```

#### 光标显示
显示其他用户的光标位置和选区：

```typescript
type CollabCursor = {
  userId: string;
  userName: string;
  color: string;
  position: { line: number; column: number };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
};
```

### 2. 冲突解决机制

使用简化版的 Operational Transformation (OT) 算法：

```typescript
class ConflictResolver {
  // 转换操作以解决冲突
  transform(op1: CollabOperation, op2: CollabOperation): CollabOperation | null {
    // 处理插入-插入冲突
    if (op1.type === "insert" && op2.type === "insert") {
      return this.transformInsertInsert(op1, op2);
    }
    // 处理删除-删除冲突
    if (op1.type === "delete" && op2.type === "delete") {
      return this.transformDeleteDelete(op1, op2);
    }
    // ...
  }
}
```

### 3. 版本控制

#### 自动保存
每 5 分钟自动创建版本快照：

```typescript
class VersionManager {
  startAutoSave(
    getContent: () => string,
    userId: string,
    userName: string
  ): void {
    this.autoSaveTimer = setInterval(() => {
      const content = getContent();
      if (content !== this.lastContent) {
        this.createVersion(content, userId, userName, "自动保存");
      }
    }, 5 * 60 * 1000);
  }
}
```

#### 版本对比
比较两个版本的差异：

```typescript
compareVersions(v1: CollabVersion, v2: CollabVersion): {
  additions: string[];
  deletions: string[];
  changes: Array<{ line: number; old: string; new: string }>;
}
```

### 4. 权限管理

#### 角色系统
- **owner**: 所有者，拥有所有权限
- **editor**: 编辑者，可以编辑和分享
- **commenter**: 评论者，只能评论
- **viewer**: 查看者，只能查看

```typescript
const ROLE_PERMISSIONS: Record<CollabRole, CollabPermission> = {
  owner: {
    canEdit: true,
    canComment: true,
    canShare: true,
    canManagePermissions: true,
    canDelete: true,
  },
  editor: {
    canEdit: true,
    canComment: true,
    canShare: true,
    canManagePermissions: false,
    canDelete: false,
  },
  // ...
};
```

### 5. 实时聊天

会话内置聊天功能，支持文本消息：

```typescript
type CollabMessage = {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: "text" | "system";
  createdAt: string;
};
```

## API 接口

### 会话管理

#### 创建会话
```
POST /api/collab/session
Body: {
  title: string;
  description?: string;
  documentType: "markdown" | "code" | "text";
  language?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}
```

#### 获取会话列表
```
GET /api/collab/session?userId=xxx
```

#### 获取单个会话
```
GET /api/collab/session?id=xxx&userId=xxx
```

#### 更新会话
```
PATCH /api/collab/session?id=xxx
Body: {
  title?: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
}
```

#### 删除会话
```
DELETE /api/collab/session?id=xxx&userId=xxx
```

### 聊天管理

#### 获取聊天记录
```
GET /api/collab/chat?sessionId=xxx
```

#### 发送消息
```
POST /api/collab/chat
Body: {
  sessionId: string;
  content: string;
  userId: string;
  userName: string;
}
```

### 版本管理

#### 获取版本历史
```
GET /api/collab/version?sessionId=xxx
```

#### 创建版本快照
```
POST /api/collab/version
Body: {
  sessionId: string;
  content: string;
  userId: string;
  userName: string;
  description?: string;
}
```

## 数据模型

### CollabSession
```typescript
type CollabSession = {
  id: string;
  title: string;
  description?: string;
  documentType: "markdown" | "code" | "text";
  language?: string;
  content: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastEditedBy: string;
  users: CollabUser[];
  permissions: Record<string, CollabRole>;
  isPublic: boolean;
  inviteCode?: string;
  tags?: string[];
};
```

### CollabUser
```typescript
type CollabUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  role: CollabRole;
  isOnline: boolean;
  lastSeen: string;
  cursor?: { line: number; column: number };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
};
```

## 使用指南

### 创建协作会话

1. 访问 `/collab` 页面
2. 点击"新建会话"按钮
3. 填写会话信息：
   - 标题
   - 描述（可选）
   - 文档类型（Markdown / 代码 / 纯文本）
   - 编程语言（代码类型时）
4. 点击"创建"

### 邀请协作者

1. 在会话页面点击"分享"按钮
2. 复制邀请链接或邀请码
3. 发送给协作者
4. 协作者通过链接加入会话

### 实时编辑

1. 在编辑器中输入内容
2. 系统自动同步到其他用户
3. 可以看到其他用户的光标位置
4. 冲突自动解决

### 版本管理

1. 点击"历史"标签查看版本历史
2. 系统每 5 分钟自动保存
3. 可以手动点击"保存"创建快照
4. 点击"恢复"回滚到历史版本
5. 点击"对比"查看版本差异

### 会话聊天

1. 点击"聊天"标签
2. 在输入框输入消息
3. 按 Enter 发送
4. 实时接收其他用户的消息

## 性能优化

### 1. 编辑器优化
- 使用 Monaco Editor 的虚拟滚动
- 延迟加载大文件
- 限制同时在线用户数

### 2. 同步优化
- 操作批处理（合并连续操作）
- 增量同步（只同步变更部分）
- 压缩传输数据

### 3. 存储优化
- IndexedDB 存储本地数据
- 定期清理旧操作记录
- 版本快照压缩

## 安全考虑

### 1. 权限验证
- 每个 API 请求都验证用户权限
- 只有所有者可以删除会话
- 只有编辑者可以修改内容

### 2. 数据保护
- 敏感信息不存储在客户端
- 邀请码定期更新
- 支持会话加密（未来）

### 3. 防止滥用
- 限制会话数量
- 限制消息频率
- 限制版本数量

## 故障处理

### 1. 网络断开
- 自动重连机制
- 本地缓存未同步操作
- 重连后自动同步

### 2. 冲突处理
- OT 算法自动解决
- 无法解决时提示用户
- 保留冲突版本

### 3. 数据丢失
- 定期备份版本快照
- 支持版本回滚
- 导出会话内容

## 未来改进

### 1. 实时通信
- 使用 WebSocket 替代轮询
- 使用 Yjs 实现 CRDT
- 支持语音/视频通话

### 2. 协作增强
- 评论和批注功能
- 任务分配和跟踪
- 变更建议和审批

### 3. 集成扩展
- 集成 Git 版本控制
- 支持导入/导出多种格式
- 集成 AI 辅助编辑

## 示例数据

运行初始化脚本创建示例数据：

```bash
node apps/web/scripts/init-collab-data.mjs
```

这将创建：
- 3 个示例协作会话
- 示例聊天消息
- 示例版本历史

## 测试

### 单元测试
```bash
npm test -- collab
```

### 集成测试
1. 创建会话
2. 邀请用户
3. 实时编辑
4. 版本管理
5. 权限控制

## 故障排查

### 问题：编辑器不显示
- 检查 Monaco Editor 是否正确加载
- 检查浏览器控制台错误
- 确认 `@monaco-editor/react` 已安装

### 问题：同步失败
- 检查网络连接
- 检查 API 响应
- 查看浏览器 IndexedDB

### 问题：权限错误
- 确认用户角色
- 检查会话权限配置
- 验证 API 权限检查

## 总结

EduNexus 协作编辑系统提供了完整的实时协作功能，包括：
- ✅ 实时协作编辑
- ✅ 用户光标显示
- ✅ 冲突自动解决
- ✅ 版本控制和回滚
- ✅ 权限管理
- ✅ 实时聊天
- ✅ 分享和邀请

系统采用模块化设计，易于扩展和维护，为用户提供流畅的协作体验。
