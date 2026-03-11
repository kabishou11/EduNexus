@echo off
chcp 65001 >nul
echo 🚀 启动 EduNexus 知识库 V2...
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node -v

REM 检查依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    call npm install
)

REM 检查环境变量
if not exist ".env.local" (
    echo ⚠️  警告: 未找到 .env.local 文件
    echo AI 功能需要配置 OpenAI API Key
    echo.
    echo 创建 .env.local 文件并添加:
    echo OPENAI_API_KEY=your_api_key_here
    echo OPENAI_API_BASE=https://api.openai.com/v1
    echo.
)

REM 启动开发服务器
echo.
echo 🎉 启动开发服务器...
echo 访问地址: http://localhost:3000/kb-v2
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev