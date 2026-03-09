# 测试 ModelScope 模型列表获取 (PowerShell)

Write-Host "🔍 测试 ModelScope 模型列表获取" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查环境变量
if (-not $env:MODELSCOPE_API_KEY) {
    Write-Host "⚠️  警告: MODELSCOPE_API_KEY 未设置" -ForegroundColor Yellow
    Write-Host "请设置环境变量或在 .env.local 中配置" -ForegroundColor Yellow
    Write-Host ""
}

# 测试直接调用 ModelScope API
Write-Host "1. 直接调用 ModelScope API" -ForegroundColor Green
Write-Host "----------------------------"
try {
    $headers = @{
        "Authorization" = "Bearer $env:MODELSCOPE_API_KEY"
    }
    $response = Invoke-RestMethod -Uri "https://api-inference.modelscope.cn/v1/models" -Headers $headers
    $qwenModels = $response.data | Where-Object { $_.id -like "*Qwen3.5*" } | Select-Object -First 10
    $qwenModels | ForEach-Object {
        Write-Host "  - $($_.id)" -ForegroundColor White
    }
} catch {
    Write-Host "  ❌ API 调用失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. 测试本地 API 端点" -ForegroundColor Green
Write-Host "----------------------------"
try {
    $localResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/models/list"
    Write-Host "  总计: $($localResponse.total) 个模型" -ForegroundColor Cyan
    Write-Host "  来源: $($localResponse.source)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  前 10 个模型:" -ForegroundColor Yellow
    $localResponse.models | Select-Object -First 10 | ForEach-Object {
        $multimodal = if ($_.multimodal) { " 🖼️" } else { "" }
        Write-Host "  - $($_.id)$multimodal" -ForegroundColor White
    }
} catch {
    Write-Host "  ❌ 本地 API 调用失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  请确保项目正在运行 (pnpm dev)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ 测试完成" -ForegroundColor Green
