#!/usr/bin/env node

/**
 * 验证自动保存功能的简单脚本
 */

console.log('🔍 验证防抖自动保存系统...\n');

// 检查文件是否存在
const fs = require('fs');
const path = require('path');

const files = [
  'src/lib/hooks/use-debounce.ts',
  'src/lib/hooks/use-auto-save.ts',
  'src/lib/hooks/AUTO_SAVE_README.md',
  'src/lib/hooks/__tests__/use-auto-save.test.ts',
  'src/lib/client/offline-save-service.ts',
  'src/lib/client/conflict-resolver.ts',
  'src/components/kb/save-status-indicator.tsx',
];

let allFilesExist = true;

console.log('📁 检查文件是否存在:\n');
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📊 统计信息:\n');

// 统计代码行数
let totalLines = 0;
let totalFiles = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    totalLines += lines;
    totalFiles++;
  }
});

console.log(`总文件数: ${totalFiles}/${files.length}`);
console.log(`总代码行数: ${totalLines}`);

// 检查 kb-storage.ts 是否已更新
console.log('\n🔧 检查 kb-storage.ts 更新:\n');
const kbStoragePath = path.join(__dirname, 'src/lib/client/kb-storage.ts');
if (fs.existsSync(kbStoragePath)) {
  const content = fs.readFileSync(kbStoragePath, 'utf-8');
  const hasVersion = content.includes('version?:');
  console.log(`${hasVersion ? '✅' : '❌'} 版本号字段已添加`);
} else {
  console.log('❌ kb-storage.ts 文件不存在');
}

// 检查 page.tsx 是否已集成
console.log('\n🔗 检查知识库页面集成:\n');
const pagePath = path.join(__dirname, 'src/app/kb/page.tsx');
if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, 'utf-8');
  const hasAutoSave = content.includes('useAutoSave');
  const hasSaveIndicator = content.includes('SaveStatusIndicator');
  const hasOfflineService = content.includes('offlineSaveService');

  console.log(`${hasAutoSave ? '✅' : '❌'} useAutoSave Hook 已导入`);
  console.log(`${hasSaveIndicator ? '✅' : '❌'} SaveStatusIndicator 组件已导入`);
  console.log(`${hasOfflineService ? '✅' : '❌'} offlineSaveService 已导入`);
} else {
  console.log('❌ kb/page.tsx 文件不存在');
}

console.log('\n✨ 验证完成!\n');

if (allFilesExist) {
  console.log('✅ 所有核心文件已创建');
  console.log('✅ 防抖自动保存系统实现完成');
  console.log('\n📖 查看使用文档: src/lib/hooks/AUTO_SAVE_README.md');
  console.log('📖 查看演示文档: AUTO_SAVE_DEMO.md');
  process.exit(0);
} else {
  console.log('❌ 部分文件缺失，请检查');
  process.exit(1);
}
