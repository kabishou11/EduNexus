# 知识库 V2 快速参考

## 🚀 快速开始

```bash
# 访问地址
http://localhost:3000/kb-v2

# 启动开发服务器
npm run dev

# 或使用启动脚本
./start-kb-v2.sh    # Linux/Mac
start-kb-v2.bat     # Windows
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + N` | 新建文档 |
| `Ctrl/Cmd + K` | 全局搜索 |
| `Ctrl/Cmd + B` | 切换左侧边栏 / 粗体 |
| `Ctrl/Cmd + \` | 切换右侧面板 |
| `Ctrl/Cmd + I` | 斜体 |
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + Shift + Z` | 重做 |

## 📐 布局

```
┌─────────────┬──────────────────────┬─────────────┐
│  左侧边栏    │    编辑区            │  右侧面板    │
│  (280px)    │    (flex-1)          │  (320px)    │
│             │                      │             │
│  知识库      │  工具栏              │  大纲        │
│  搜索        │  标题                │  AI 功能     │
│  文档树      │  编辑器              │  属性        │
│  新建        │                      │  历史        │
└─────────────┴──────────────────────┴─────────────┘
```

## 🎨 主要功能

### 编辑器
- ✅ 富文本编辑
- ✅ Markdown 支持
- ✅ 标题 (H1-H6)
- ✅ 列表（无序、有序、任务）
- ✅ 表格
- ✅ 代码块
- ✅ 图片和链接
- ✅ 自动保存

### AI 功能
- ✅ 思维导图生成
- ✅ 文档摘要
- ✅ AI 问答

### 文档管理
- ✅ 全局搜索
- ✅ 最近访问
- ✅ 标签管理
- ✅ 导出 Markdown

## 🔧 配置

### 环境变量 (.env.local)
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
```

## 📚 文档

- [设计文档](./KB_V2_DESIGN.md)
- [使用指南](./KB_V2_USER_GUIDE.md)
- [功能对比](./KB_V1_VS_V2.md)
- [更新日志](./KB_V2_CHANGELOG.md)
- [实现总结](./KB_V2_IMPLEMENTATION_SUMMARY.md)

## 🐛 问题反馈

GitHub Issues: https://github.com/your-repo/edunexus/issues

## 💡 提示

1. 使用快捷键提高效率
2. 定期导出重要文档
3. 合理使用 AI 功能
4. 善用标签组织文档

---

**版本**: 2.0.0 | **更新**: 2026-03-11