#!/bin/bash

echo "🔍 验证 EduNexus 高级分析系统实现..."
echo ""

# 检查核心库文件
echo "📚 检查核心库文件..."
files=(
  "apps/web/src/lib/analytics/analytics-types.ts"
  "apps/web/src/lib/analytics/data-aggregator.ts"
  "apps/web/src/lib/analytics/insight-generator.ts"
  "apps/web/src/lib/analytics/analytics-engine.ts"
  "apps/web/src/lib/analytics/report-builder.ts"
  "apps/web/src/lib/analytics/export-manager.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""

# 检查 API 路由
echo "🌐 检查 API 路由..."
api_files=(
  "apps/web/src/app/api/analytics/stats/route.ts"
  "apps/web/src/app/api/analytics/insights/route.ts"
  "apps/web/src/app/api/analytics/reports/route.ts"
  "apps/web/src/app/api/analytics/export/route.ts"
)

for file in "${api_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""

# 检查 React 组件
echo "⚛️  检查 React 组件..."
component_files=(
  "apps/web/src/components/analytics/analytics-dashboard.tsx"
  "apps/web/src/components/analytics/ai-insights-panel.tsx"
  "apps/web/src/components/analytics/learning-chart.tsx"
  "apps/web/src/components/analytics/activity-heatmap.tsx"
)

for file in "${component_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""

# 检查文档
echo "📖 检查文档..."
doc_files=(
  "docs/ADVANCED_ANALYTICS.md"
  "ANALYTICS_IMPLEMENTATION_SUMMARY.md"
  "apps/web/src/components/analytics/README.md"
)

for file in "${doc_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""

# 统计代码行数
echo "📊 代码统计..."
echo "  核心库: $(find apps/web/src/lib/analytics -name "*.ts" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}') 行"
echo "  API 路由: $(find apps/web/src/app/api/analytics -name "*.ts" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}') 行"
echo "  React 组件: $(find apps/web/src/components/analytics -name "*.tsx" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}') 行"

echo ""
echo "✨ 验证完成！"
