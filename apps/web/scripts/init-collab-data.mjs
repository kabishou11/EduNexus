#!/usr/bin/env node

/**
 * 初始化协作编辑系统示例数据
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 查找项目根目录
function findProjectRoot() {
  let current = __dirname;
  for (let i = 0; i < 5; i++) {
    const vaultPath = path.join(current, "vault");
    try {
      if (fs.statSync(vaultPath)) {
        return current;
      }
    } catch {
      current = path.dirname(current);
    }
  }
  return process.cwd();
}

const projectRoot = findProjectRoot();
const dbPath = path.join(projectRoot, ".edunexus", "data", "db.json");

async function initCollabData() {
  console.log("初始化协作编辑系统示例数据...");

  try {
    // 读取现有数据
    let db = {};
    try {
      const content = await fs.readFile(dbPath, "utf8");
      db = JSON.parse(content);
    } catch {
      console.log("数据库文件不存在，将创建新文件");
    }

    // 创建示例协作会话
    const now = new Date().toISOString();
    const collabSessions = [
      {
        id: "collab_demo_1",
        title: "React 组件设计文档",
        description: "讨论新的组件架构设计",
        documentType: "markdown",
        content: `# React 组件设计文档

## 概述
本文档用于讨论和设计新的 React 组件架构。

## 组件结构
- 容器组件
- 展示组件
- 自定义 Hooks

## 待讨论问题
1. 状态管理方案
2. 性能优化策略
3. 测试覆盖率

## 下一步
- [ ] 完成组件原型
- [ ] 编写单元测试
- [ ] 性能基准测试
`,
        ownerId: "demo_user",
        createdAt: now,
        updatedAt: now,
        lastEditedBy: "demo_user",
        users: [],
        permissions: {
          demo_user: "owner",
        },
        isPublic: false,
        inviteCode: "REACT2024",
        tags: ["React", "设计", "架构"],
      },
      {
        id: "collab_demo_2",
        title: "算法实现：快速排序",
        description: "协作实现快速排序算法",
        documentType: "code",
        language: "javascript",
        content: `// 快速排序实现
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 测试用例
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("原始数组:", testArray);
console.log("排序后:", quickSort(testArray));

// TODO: 优化空间复杂度
// TODO: 添加更多测试用例
`,
        ownerId: "demo_user",
        createdAt: now,
        updatedAt: now,
        lastEditedBy: "demo_user",
        users: [],
        permissions: {
          demo_user: "owner",
        },
        isPublic: true,
        inviteCode: "ALGO2024",
        tags: ["算法", "JavaScript", "排序"],
      },
      {
        id: "collab_demo_3",
        title: "项目需求文档",
        description: "EduNexus 新功能需求讨论",
        documentType: "markdown",
        content: `# EduNexus 新功能需求

## 功能概述
协作编辑系统，支持多人实时编辑文档和代码。

## 核心功能
1. **实时协作编辑**
   - 多人同时编辑
   - 光标位置显示
   - 冲突自动解决

2. **版本控制**
   - 自动保存快照
   - 版本历史查看
   - 版本对比和回滚

3. **权限管理**
   - 角色系统（所有者、编辑者、查看者）
   - 邀请链接分享
   - 细粒度权限控制

## 技术方案
- WebSocket 实时通信
- CRDT 冲突解决
- Monaco Editor

## 时间规划
- Week 1: 基础架构
- Week 2: 实时同步
- Week 3: 版本控制
- Week 4: 测试优化
`,
        ownerId: "demo_user",
        createdAt: now,
        updatedAt: now,
        lastEditedBy: "demo_user",
        users: [],
        permissions: {
          demo_user: "owner",
        },
        isPublic: false,
        inviteCode: "EDUNEXUS",
        tags: ["需求", "文档", "协作"],
      },
    ];

    // 创建示例消息
    const collabMessages = [
      {
        id: "msg_demo_1",
        sessionId: "collab_demo_1",
        userId: "demo_user",
        userName: "演示用户",
        content: "大家好，我们开始讨论组件设计吧",
        type: "text",
        createdAt: now,
      },
      {
        id: "msg_demo_2",
        sessionId: "collab_demo_1",
        userId: "user_2",
        userName: "张三",
        content: "我觉得可以先从状态管理开始",
        type: "text",
        createdAt: new Date(Date.now() + 60000).toISOString(),
      },
      {
        id: "msg_demo_3",
        sessionId: "collab_demo_2",
        userId: "demo_user",
        userName: "演示用户",
        content: "这个算法实现看起来不错，但可以优化空间复杂度",
        type: "text",
        createdAt: now,
      },
    ];

    // 创建示例版本
    const collabVersions = [
      {
        id: "ver_demo_1",
        sessionId: "collab_demo_1",
        content: "# React 组件设计文档\n\n初始版本",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        createdBy: "demo_user",
        createdByName: "演示用户",
        description: "初始版本",
        changesSummary: "创建文档",
      },
      {
        id: "ver_demo_2",
        sessionId: "collab_demo_1",
        content: collabSessions[0].content,
        createdAt: now,
        createdBy: "demo_user",
        createdByName: "演示用户",
        description: "添加详细内容",
        changesSummary: "新增 15 行",
      },
    ];

    // 更新数据库
    db.collabSessions = collabSessions;
    db.collabMessages = collabMessages;
    db.collabVersions = collabVersions;

    // 保存数据
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");

    console.log("✓ 成功创建 3 个示例协作会话");
    console.log("✓ 成功创建示例消息和版本历史");
    console.log("\n示例会话:");
    collabSessions.forEach((session, index) => {
      console.log(`  ${index + 1}. ${session.title} (${session.documentType})`);
      console.log(`     邀请码: ${session.inviteCode}`);
    });
    console.log("\n初始化完成！");
  } catch (error) {
    console.error("初始化失败:", error);
    process.exit(1);
  }
}

initCollabData();
