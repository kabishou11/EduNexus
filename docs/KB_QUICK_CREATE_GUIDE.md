# 知识宝库多入口快速创建系统使用指南

## 概述

知识宝库现在支持多种方式快速创建笔记，提供更灵活、高效的创作体验。

## 功能特性

### 1. 全局快捷键

系统支持跨平台的全局快捷键，自动适配 Mac 和 Windows 系统。

#### 可用快捷键

| 快捷键 | Mac | Windows | 功能 |
|--------|-----|---------|------|
| 快速创建 | ⌘⇧N | Ctrl+Shift+N | 打开快速创建对话框 |
| 保存文档 | ⌘S | Ctrl+S | 保存当前编辑的文档 |
| 切换编辑 | ⌘E | Ctrl+E | 切换编辑/预览模式 |
| 退出全屏 | Esc | Esc | 退出全屏模式 |

#### 特性

- **智能上下文感知**：在输入框中自动禁用非必要快捷键
- **跨平台支持**：自动识别 Mac 和 Windows 系统
- **冲突避免**：避免与浏览器默认快捷键冲突
- **可扩展**：支持自定义快捷键配置

### 2. 浮动创建按钮

页面右下角的浮动按钮提供快速访问创建功能。

#### 功能

- **空白笔记**：创建一个全新的空白笔记
- **使用模板**：从预设模板快速开始
- **快速记录**：快速记录想法和灵感

#### 特性

- **平滑动画**：优雅的展开/收起动画效果
- **位置可调**：支持四个角落位置（默认右下角）
- **不遮挡内容**：智能定位，不影响阅读体验
- **工具提示**：鼠标悬停显示功能说明

### 3. 快速创建对话框

统一的创建对话框，支持多种创建方式。

#### 功能

- **标题输入**：输入笔记标题
- **内容编辑**：编写笔记内容
- **标签管理**：添加和管理标签
- **模板选择**：选择预设模板（模板模式）
- **节点关联**：关联到知识星图节点

#### 特性

- **自动生成标题**：根据内容自动生成标题
- **自动提取标签**：从内容中自动提取 # 标签
- **键盘导航**：支持 Tab、Enter 键盘操作
- **ESC 关闭**：按 ESC 键快速关闭
- **表单验证**：实时验证输入内容

### 4. 右键菜单创建

选中文字后右键可快速保存到知识宝库。

#### 功能

- **保存到知识宝库**：将选中文字保存为新笔记
- **创建双向链接**：创建文档间的双向链接
- **提取标签**：从选中文字提取标签
- **复制文本**：快速复制选中文本

#### 特性

- **智能选择检测**：自动检测是否有选中文字
- **上下文菜单**：只在有选中内容时显示相关选项
- **快捷键提示**：显示对应的快捷键

### 5. 智能创建服务

统一的后端服务处理所有创建请求。

#### 功能

- **空白创建**：创建空白笔记
- **模板创建**：基于模板创建
- **快速记录**：快速记录想法
- **选中文字创建**：从选中文字创建
- **知识图谱创建**：从知识星图节点创建

#### 特性

- **自动生成标题**：智能提取第一行或生成时间戳标题
- **自动提取标签**：从内容中提取 # 标签
- **批量创建**：支持批量创建多个笔记
- **验证检查**：创建前验证数据有效性

## 使用场景

### 场景 1：快速记录灵感

1. 按 `Ctrl+Shift+N`（或 `⌘⇧N`）打开快速创建对话框
2. 输入标题和内容
3. 添加标签（可选）
4. 点击"创建"按钮

### 场景 2：从模板创建

1. 点击右下角浮动按钮
2. 选择"使用模板"
3. 在对话框中选择模板
4. 填写标题和内容
5. 点击"创建"按钮

### 场景 3：保存选中文字

1. 在文档中选中要保存的文字
2. 右键点击选中区域
3. 选择"保存到知识宝库"
4. 在弹出的对话框中编辑标题和标签
5. 点击"创建"按钮

### 场景 4：从知识星图创建

1. 在知识星图中选择一个节点
2. 点击节点上的"创建笔记"按钮
3. 系统自动关联节点信息
4. 填写内容
5. 点击"创建"按钮

## 技术实现

### 架构设计

```
┌─────────────────────────────────────────┐
│           用户界面层                      │
├─────────────────────────────────────────┤
│  - 浮动创建按钮                           │
│  - 快速创建对话框                         │
│  - 右键菜单                               │
│  - 全局快捷键                             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           服务层                          │
├─────────────────────────────────────────┤
│  - QuickCreateService                    │
│    - createBlank()                       │
│    - createFromTemplate()                │
│    - createFromSelection()               │
│    - createFromKnowledgeGraph()          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           存储层                          │
├─────────────────────────────────────────┤
│  - KBStorage (IndexedDB)                 │
│  - 文档管理                               │
│  - 标签管理                               │
└─────────────────────────────────────────┘
```

### 核心组件

#### 1. useGlobalShortcuts Hook

```typescript
// 使用示例
useGlobalShortcuts([
  {
    key: 'n',
    ctrl: true,
    shift: true,
    handler: () => openQuickCreate(),
    description: '快速创建笔记'
  }
]);
```

#### 2. FloatingCreateButton 组件

```typescript
<FloatingCreateButton
  onCreateBlank={() => handleCreate('blank')}
  onCreateFromTemplate={() => handleCreate('template')}
  onQuickNote={() => handleCreate('quick')}
  position="bottom-right"
/>
```

#### 3. QuickCreateDialog 组件

```typescript
<QuickCreateDialog
  open={open}
  onOpenChange={setOpen}
  type="blank"
  initialData={{ content: selectedText }}
  onConfirm={handleCreate}
/>
```

#### 4. ContextMenuCreate 组件

```typescript
<ContextMenuCreate
  onSaveToKB={handleSave}
  onCreateLink={handleLink}
  onExtractTags={handleTags}
>
  <div>可右键的内容</div>
</ContextMenuCreate>
```

#### 5. QuickCreateService 服务

```typescript
import { quickCreateService } from '@/lib/kb/quick-create-service';

// 创建空白笔记
const result = await quickCreateService.createBlank({
  title: '我的笔记',
  content: '笔记内容',
  tags: ['标签1', '标签2'],
  vaultId: 'vault-id'
});

// 从选中文字创建
const result = await quickCreateService.createFromSelection(
  selectedText,
  { vaultId: 'vault-id' }
);
```

## 代码规范

### TypeScript 严格模式

所有组件使用 TypeScript 严格模式，确保类型安全。

```typescript
// ✅ 正确
interface Props {
  onConfirm: (data: QuickCreateData) => void;
}

// ❌ 错误
interface Props {
  onConfirm: (data: any) => void;
}
```

### React 性能优化

使用 `React.memo`、`useCallback`、`useMemo` 优化性能。

```typescript
// 使用 memo 避免不必要的重渲染
export const FloatingCreateButton = memo(function FloatingCreateButton(props) {
  // 使用 useCallback 缓存回调函数
  const handleCreate = useCallback((type: string) => {
    // ...
  }, [dependencies]);

  // 使用 useMemo 缓存计算结果
  const options = useMemo(() => {
    return computeOptions();
  }, [dependencies]);
});
```

### 事件处理类型

所有事件处理函数添加明确的类型。

```typescript
// ✅ 正确
const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
  // ...
}, []);

// ❌ 错误
const handleKeyDown = useCallback((e) => {
  // ...
}, []);
```

## 测试建议

### 单元测试

```typescript
describe('useGlobalShortcuts', () => {
  it('should trigger handler on correct key combination', () => {
    const handler = jest.fn();
    renderHook(() => useGlobalShortcuts([
      { key: 'n', ctrl: true, shift: true, handler }
    ]));

    fireEvent.keyDown(window, {
      key: 'n',
      ctrlKey: true,
      shiftKey: true
    });

    expect(handler).toHaveBeenCalled();
  });
});
```

### 集成测试

```typescript
describe('Quick Create Flow', () => {
  it('should create note from floating button', async () => {
    render(<KnowledgeBasePage />);

    // 点击浮动按钮
    fireEvent.click(screen.getByRole('button', { name: /快速创建/i }));

    // 选择空白笔记
    fireEvent.click(screen.getByText('空白笔记'));

    // 填写表单
    fireEvent.change(screen.getByPlaceholderText('输入笔记标题'), {
      target: { value: '测试笔记' }
    });

    // 提交
    fireEvent.click(screen.getByText('创建'));

    // 验证结果
    await waitFor(() => {
      expect(screen.getByText('测试笔记')).toBeInTheDocument();
    });
  });
});
```

### E2E 测试

```typescript
test('complete quick create workflow', async ({ page }) => {
  await page.goto('/kb');

  // 使用快捷键
  await page.keyboard.press('Control+Shift+N');

  // 填写表单
  await page.fill('[placeholder="输入笔记标题"]', '测试笔记');
  await page.fill('[placeholder="输入笔记内容"]', '这是测试内容');

  // 添加标签
  await page.fill('[placeholder="添加标签"]', '测试');
  await page.keyboard.press('Enter');

  // 创建
  await page.click('text=创建');

  // 验证
  await expect(page.locator('text=测试笔记')).toBeVisible();
});
```

## 常见问题

### Q1: 快捷键不生效？

**A:** 检查以下几点：
1. 确保没有其他应用占用相同快捷键
2. 检查是否在输入框中（某些快捷键在输入框中被禁用）
3. 确认浏览器没有拦截快捷键

### Q2: 浮动按钮遮挡内容？

**A:** 可以通过 `position` 属性调整按钮位置：
```typescript
<FloatingCreateButton position="bottom-left" />
```

### Q3: 右键菜单不显示？

**A:** 确保：
1. 已选中文字
2. 已选择知识库
3. 组件正确包裹内容区域

### Q4: 自动生成的标题不理想？

**A:** 可以手动修改标题，或者：
1. 在内容第一行使用 Markdown 标题格式
2. 使用有意义的第一句话

## 最佳实践

### 1. 快捷键使用

- 熟记常用快捷键，提高效率
- 在不同场景使用不同的创建方式
- 利用快捷键快速保存和切换模式

### 2. 标签管理

- 使用一致的标签命名规范
- 避免创建过多相似标签
- 利用自动提取功能，在内容中使用 # 标签

### 3. 模板使用

- 为常用笔记类型创建模板
- 模板中包含常用的结构和提示
- 定期更新和优化模板

### 4. 内容组织

- 使用有意义的标题
- 合理使用标签分类
- 利用双向链接建立知识网络

## 更新日志

### v1.0.0 (2026-03-09)

- ✨ 新增全局快捷键系统
- ✨ 新增浮动创建按钮
- ✨ 新增快速创建对话框
- ✨ 新增右键菜单创建
- ✨ 新增智能创建服务
- 🎨 优化创建流程用户体验
- 📝 完善文档和使用指南

## 反馈与支持

如有问题或建议，请通过以下方式反馈：

- GitHub Issues
- 项目文档
- 开发团队邮箱

---

**文档版本**: v1.0.0
**最后更新**: 2026-03-09
**维护者**: EduNexus 开发团队
