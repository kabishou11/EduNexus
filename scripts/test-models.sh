#!/bin/bash

# 测试 ModelScope 模型列表获取

echo "🔍 测试 ModelScope 模型列表获取"
echo "================================"
echo ""

# 检查环境变量
if [ -z "$MODELSCOPE_API_KEY" ]; then
    echo "⚠️  警告: MODELSCOPE_API_KEY 未设置"
    echo "请设置环境变量或在 .env.local 中配置"
    echo ""
fi

# 测试直接调用 ModelScope API
echo "1. 直接调用 ModelScope API"
echo "----------------------------"
curl -s -H "Authorization: Bearer $MODELSCOPE_API_KEY" \
    https://api-inference.modelscope.cn/v1/models \
    | jq '.data[] | select(.id | contains("Qwen3.5")) | {id, description}' \
    | head -20

echo ""
echo "2. 测试本地 API 端点"
echo "----------------------------"
curl -s http://localhost:3000/api/models/list | jq '.models[] | {id, name, multimodal}'

echo ""
echo "✅ 测试完成"
