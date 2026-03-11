#!/bin/bash

# EduNexus 知识库 V2 快速启动脚本

echo "🚀 启动 EduNexus 知识库 V2..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查环境变量
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告: 未找到 .env.local 文件"
    echo "AI 功能需要配置 OpenAI API Key"
    echo ""
    echo "创建 .env.local 文件并添加:"
    echo "OPENAI_API_KEY=your_api_key_here"
    echo "OPENAI_API_BASE=https://api.openai.com/v1"
    echo ""
fi

# 启动开发服务器
echo ""
echo "🎉 启动开发服务器..."
echo "访问地址: http://localhost:3000/kb-v2"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev