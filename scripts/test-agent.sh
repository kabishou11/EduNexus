#!/bin/bash

# EduNexus Agent 功能测试脚本

echo "🚀 EduNexus Agent 功能测试"
echo "================================"
echo ""

BASE_URL="http://localhost:3000"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
PASSED=0
FAILED=0

# 测试函数
test_api() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4

    echo -n "测试: $name ... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ 失败 (HTTP $http_code)${NC}"
        echo "  响应: $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "1. 测试 ModelScope API 连接"
echo "----------------------------"
test_api "ModelScope 连接测试" "GET" "/api/test/modelscope"
echo ""

echo "2. 测试模型列表获取"
echo "----------------------------"
test_api "获取模型列表" "GET" "/api/models/list"
echo ""

echo "3. 测试 Agent 对话"
echo "----------------------------"
test_api "Agent 标准对话" "POST" "/api/workspace/agent/chat" '{
  "message": "你好，这是一个测试",
  "history": [],
  "config": {
    "socraticMode": false,
    "temperature": 0.3,
    "maxIterations": 3
  }
}'
echo ""

echo "4. 测试苏格拉底模式"
echo "----------------------------"
test_api "苏格拉底模式对话" "POST" "/api/workspace/agent/chat" '{
  "message": "什么是机器学习？",
  "history": [],
  "config": {
    "socraticMode": true,
    "temperature": 0.7,
    "maxIterations": 5
  }
}'
echo ""

echo "5. 测试知识库 AI"
echo "----------------------------"
test_api "知识库 AI 助手" "POST" "/api/kb/ai/chat" '{
  "documentTitle": "测试文档",
  "documentContent": "这是一个测试文档的内容",
  "userInput": "请总结这个文档",
  "conversationHistory": []
}'
echo ""

echo "================================"
echo "测试结果汇总"
echo "================================"
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo "总计: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $FAILED 个测试失败${NC}"
    exit 1
fi
