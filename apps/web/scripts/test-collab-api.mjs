#!/usr/bin/env node

/**
 * 协作编辑系统 API 测试脚本
 */

const BASE_URL = "http://localhost:3000";
const USER_ID = "demo_user";
const USER_NAME = "测试用户";

async function testAPI(name, method, url, body = null) {
  console.log(`\n🧪 测试: ${name}`);
  console.log(`   ${method} ${url}`);

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
      console.log(`   Body:`, JSON.stringify(body, null, 2));
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ 成功 (${response.status})`);
      console.log(`   响应:`, JSON.stringify(data, null, 2).substring(0, 200));
      return data;
    } else {
      console.log(`   ❌ 失败 (${response.status})`);
      console.log(`   错误:`, data);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ 异常:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("协作编辑系统 API 测试");
  console.log("=".repeat(60));

  // 1. 获取会话列表
  const sessions = await testAPI(
    "获取会话列表",
    "GET",
    `${BASE_URL}/api/collab/session?userId=${USER_ID}`
  );

  if (!sessions || sessions.length === 0) {
    console.log("\n⚠️  没有找到会话，请先运行初始化脚本:");
    console.log("   node apps/web/scripts/init-collab-data.mjs");
    return;
  }

  const sessionId = sessions[0].id;
  console.log(`\n📝 使用会话 ID: ${sessionId}`);

  // 2. 获取单个会话
  await testAPI(
    "获取单个会话",
    "GET",
    `${BASE_URL}/api/collab/session?id=${sessionId}&userId=${USER_ID}`
  );

  // 3. 创建新会话
  const newSession = await testAPI(
    "创建新会话",
    "POST",
    `${BASE_URL}/api/collab/session`,
    {
      title: "API 测试会话",
      description: "通过 API 测试脚本创建",
      documentType: "markdown",
      content: "# 测试内容\n\n这是一个测试会话。",
      userId: USER_ID,
      userName: USER_NAME,
      isPublic: false,
      tags: ["测试", "API"],
    }
  );

  if (newSession) {
    const newSessionId = newSession.id;

    // 4. 更新会话
    await testAPI(
      "更新会话",
      "PATCH",
      `${BASE_URL}/api/collab/session?id=${newSessionId}`,
      {
        title: "API 测试会话（已更新）",
        content: "# 更新后的内容\n\n内容已更新。",
        userId: USER_ID,
      }
    );

    // 5. 获取聊天记录
    await testAPI(
      "获取聊天记录",
      "GET",
      `${BASE_URL}/api/collab/chat?sessionId=${newSessionId}`
    );

    // 6. 发送消息
    await testAPI(
      "发送消息",
      "POST",
      `${BASE_URL}/api/collab/chat`,
      {
        sessionId: newSessionId,
        content: "这是一条测试消息",
        userId: USER_ID,
        userName: USER_NAME,
      }
    );

    // 7. 再次获取聊天记录
    await testAPI(
      "再次获取聊天记录",
      "GET",
      `${BASE_URL}/api/collab/chat?sessionId=${newSessionId}`
    );

    // 8. 创建版本快照
    await testAPI(
      "创建版本快照",
      "POST",
      `${BASE_URL}/api/collab/version`,
      {
        sessionId: newSessionId,
        content: "# 版本快照\n\n这是一个版本快照。",
        userId: USER_ID,
        userName: USER_NAME,
        description: "API 测试版本",
      }
    );

    // 9. 获取版本历史
    await testAPI(
      "获取版本历史",
      "GET",
      `${BASE_URL}/api/collab/version?sessionId=${newSessionId}`
    );

    // 10. 删除会话
    await testAPI(
      "删除会话",
      "DELETE",
      `${BASE_URL}/api/collab/session?id=${newSessionId}&userId=${USER_ID}`
    );
  }

  console.log("\n" + "=".repeat(60));
  console.log("测试完成！");
  console.log("=".repeat(60));
}

// 检查服务器是否运行
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/collab/session?userId=${USER_ID}`);
    return response.ok || response.status === 404;
  } catch {
    return false;
  }
}

// 主函数
async function main() {
  console.log("检查服务器状态...");
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log("\n❌ 服务器未运行！");
    console.log("请先启动开发服务器:");
    console.log("  cd apps/web");
    console.log("  npm run dev");
    process.exit(1);
  }

  console.log("✅ 服务器正在运行\n");
  await runTests();
}

main().catch(console.error);
