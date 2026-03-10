# 协作编辑系统快速开始

## 快速体验

### 1. 初始化示例数据

```bash
node apps/web/scripts/init-collab-data.mjs
```

这将创建 3 个示例协作会话：
- React 组件设计文档 (Markdown)
- 算法实现：快速排序 (JavaScript)
- 项目需求文档 (Markdown)

### 2. 启动开发服务器

```bash
cd apps/web
npm run dev
```

### 3. 访问协作编辑

打开浏览器访问：
```
http://localhost:3000/collab
```

## 功能演示

### 创建新会话

1. 点击"新建会话"按钮
2. 填写信息：
   - 标题：我的第一个协作文档
   - 描述：测试协作编辑功能
   - 文档类型：Markdown
3. 点击"创建"

### 编辑文档

1. 在编辑器中输入内容
2. 内容自动保存
3. 切换到"预览"标签查看效果

### 分享会话

1. 点击"分享"按钮
2. 复制邀请链接
3. 在新标签页打开链接（模拟多用户）

### 查看版本历史

1. 点击右侧"历史"标签
2. 查看所有版本快照
3. 点击"恢复"回滚到历史版本
4. 点击"对比"查看版本差异

### 使用聊天功能

1. 点击右侧"聊天"标签
2. 输入消息并发送
3. 查看聊天历史

## 示例会话

### 1. React 组件设计文档
- **类型**: Markdown
- **邀请码**: REACT2024
- **内容**: React 组件架构设计讨论

### 2. 算法实现：快速排序
- **类型**: JavaScript 代码
- **邀请码**: ALGO2024
- **内容**: 快速排序算法实现

### 3. 项目需求文档
- **类型**: Markdown
- **邀请码**: EDUNEXUS
- **内容**: EduNexus 新功能需求

## API 测试

### 获取会话列表
```bash
curl http://localhost:3000/api/collab/session?userId=demo_user
```

### 创建会话
```bash
curl -X POST http://localhost:3000/api/collab/session \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试会话",
    "documentType": "markdown",
    "userId": "demo_user",
    "userName": "测试用户"
  }'
```

### 发送消息
```bash
curl -X POST http://localhost:3000/api/collab/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "collab_demo_1",
    "content": "测试消息",
    "userId": "demo_user",
    "userName": "测试用户"
  }'
```

### 创建版本
```bash
curl -X POST http://localhost:3000/api/collab/version \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "collab_demo_1",
    "content": "版本内容",
    "userId": "demo_user",
    "userName": "测试用户",
    "description": "测试版本"
  }'
```

## 常见问题

### Q: 如何模拟多用户协作？
A: 在不同浏览器或隐身窗口中打开同一个会话链接。

### Q: 编辑器不显示怎么办？
A: 检查浏览器控制台是否有错误，确认 Monaco Editor 正确加载。

### Q: 如何清除示例数据？
A: 删除 `.edunexus/data/db.json` 文件，然后重新运行初始化脚本。

### Q: 支持哪些编程语言？
A: 支持 JavaScript, TypeScript, Python, Java, C++ 等常见语言。

### Q: 如何导出会话内容？
A: 在编辑器中选择全部内容，复制到剪贴板或保存为文件。

## 下一步

- 查看完整文档：`docs/COLLAB_SYSTEM.md`
- 了解 API 接口：查看 `apps/web/src/app/api/collab/` 目录
- 自定义组件：修改 `apps/web/src/components/collab/` 目录
- 扩展功能：参考 `apps/web/src/lib/collab/` 目录

## 技术支持

如有问题，请查看：
- 系统文档：`docs/COLLAB_SYSTEM.md`
- 代码注释：查看源代码中的详细注释
- 示例数据：运行初始化脚本查看示例

祝使用愉快！
