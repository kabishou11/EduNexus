# PWA Icons Generation Guide

## 图标要求

PWA 需要多种尺寸的图标以适配不同设备和场景：

- **72x72**: Android 小图标
- **96x96**: Android 中图标
- **128x128**: Android 大图标
- **144x144**: Windows 磁贴
- **152x152**: iOS 图标
- **192x192**: Android 启动图标
- **384x384**: Android 高分辨率
- **512x512**: Android 超高分辨率

## 生成方法

### 方法 1: 使用 PWA Asset Generator (推荐)

```bash
# 安装
npm install -g pwa-asset-generator

# 生成图标（需要准备一个 logo.png 文件）
pwa-asset-generator logo.png public/icons --icon-only --padding "10%"
```

### 方法 2: 使用在线工具

1. **RealFaviconGenerator**
   - 访问: https://realfavicongenerator.net/
   - 上传 logo 图片
   - 选择 "PWA" 选项
   - 下载生成的图标包

2. **PWA Builder**
   - 访问: https://www.pwabuilder.com/imageGenerator
   - 上传 logo 图片
   - 下载生成的图标

3. **Favicon.io**
   - 访问: https://favicon.io/
   - 上传图片或使用文字生成
   - 下载图标包

### 方法 3: 使用 ImageMagick

如果已安装 ImageMagick，可以使用命令行批量生成：

```bash
# 从 logo.png 生成所有尺寸
convert logo.png -resize 72x72 public/icons/icon-72x72.png
convert logo.png -resize 96x96 public/icons/icon-96x96.png
convert logo.png -resize 128x128 public/icons/icon-128x128.png
convert logo.png -resize 144x144 public/icons/icon-144x144.png
convert logo.png -resize 152x152 public/icons/icon-152x152.png
convert logo.png -resize 192x192 public/icons/icon-192x192.png
convert logo.png -resize 384x384 public/icons/icon-384x384.png
convert logo.png -resize 512x512 public/icons/icon-512x512.png
```

### 方法 4: 使用 Sharp (Node.js)

创建一个脚本 `scripts/generate-icons.mjs`:

```javascript
import sharp from 'sharp';
import { mkdir } from 'fs/promises';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = 'logo.png';
const outputDir = 'public/icons';

await mkdir(outputDir, { recursive: true });

for (const size of sizes) {
  await sharp(inputFile)
    .resize(size, size)
    .toFile(`${outputDir}/icon-${size}x${size}.png`);
  console.log(`Generated icon-${size}x${size}.png`);
}

console.log('All icons generated successfully!');
```

运行:
```bash
npm install sharp
node scripts/generate-icons.mjs
```

## 图标设计建议

### 1. 尺寸和格式
- 使用 PNG 格式
- 建议原始图片至少 512x512
- 保持正方形比例
- 使用透明背景（可选）

### 2. 设计原则
- 简洁明了，易于识别
- 在小尺寸下仍清晰可见
- 使用品牌色彩
- 避免过多细节

### 3. 安全区域
- 为 maskable 图标预留 10-20% 的安全边距
- 重要内容放在中心 80% 区域

### 4. 测试
- 在不同设备上测试显示效果
- 检查亮色和暗色主题下的显示
- 验证启动画面效果

## Maskable Icons

Maskable icons 可以适配不同形状的图标遮罩（圆形、圆角矩形等）。

### 创建 Maskable Icon

1. 访问 [Maskable.app](https://maskable.app/editor)
2. 上传图标
3. 调整安全区域
4. 导出图标

### 在 manifest.json 中使用

```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 临时解决方案

如果暂时没有设计好的图标，可以：

1. **使用占位图标**
   - 从 [Placeholder.com](https://placeholder.com/) 生成
   - 使用纯色背景 + 文字

2. **使用 Logo 文字**
   - 使用 Canvas 或 SVG 生成文字图标
   - 简单但有效

3. **使用现有图标库**
   - [Heroicons](https://heroicons.com/)
   - [Lucide Icons](https://lucide.dev/)
   - [Material Icons](https://fonts.google.com/icons)

## 验证图标

生成图标后，验证是否正确：

1. 检查文件是否存在
```bash
ls -lh public/icons/
```

2. 使用 Chrome DevTools
   - 打开 Application > Manifest
   - 查看图标预览

3. 使用 Lighthouse
   - 运行 PWA 审计
   - 检查图标相关项

## 常见问题

### Q: 图标不显示？
A: 检查文件路径、文件名和 manifest.json 配置是否一致。

### Q: 图标模糊？
A: 确保原始图片分辨率足够高，至少 512x512。

### Q: iOS 图标不显示？
A: 需要在 HTML head 中添加 apple-touch-icon 链接。

### Q: 图标被裁剪？
A: 使用 maskable 图标并预留足够的安全边距。

---

**注意**: 图标是 PWA 的重要组成部分，建议使用专业设计的图标以提供最佳用户体验。
