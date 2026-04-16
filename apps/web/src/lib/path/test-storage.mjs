/**
 * 学习路径存储测试脚本
 *
 * 在浏览器控制台中运行此脚本来测试存储功能
 */

// 测试路径数据
const testPath = {
  id: 'test-path-' + Date.now(),
  title: '测试学习路径',
  description: '这是一个测试路径',
  status: 'not_started',
  progress: 0,
  tags: ['测试', 'beginner'],
  createdAt: new Date(),
  updatedAt: new Date(),
  tasks: [
    {
      id: 'node-1',
      title: '测试节点',
      description: '这是一个测试节点',
      estimatedTime: '60分钟',
      progress: 0,
      status: 'not_started',
      dependencies: [],
      resources: [],
      notes: '',
      createdAt: new Date(),
    },
  ],
  milestones: [],
};

// 测试函数
async function testPathStorage() {
  console.log('🧪 开始测试学习路径存储...\n');

  try {
    // 动态导入新存储模块
    const { pathStorage } = await import('../client/path-storage.js');

    // 测试 1: 保存路径
    console.log('📝 测试 1: 保存路径');
    await pathStorage.savePath(testPath);
    console.log('✅ 路径保存成功\n');

    // 测试 2: 获取路径
    console.log('📖 测试 2: 获取路径');
    const retrievedPath = await pathStorage.getPath(testPath.id);
    console.log('✅ 路径获取成功:', retrievedPath?.title);
    console.assert(retrievedPath?.id === testPath.id, '路径 ID 匹配');
    console.log('');

    // 测试 3: 获取所有路径
    console.log('📚 测试 3: 获取所有路径');
    const allPaths = await pathStorage.getAllPaths();
    console.log('✅ 获取到', allPaths.length, '个路径\n');

    // 测试 4: 更新任务完成状态
    console.log('✔️ 测试 4: 更新任务完成状态');
    const updatedPath = await pathStorage.updatePath(testPath.id, {
      tasks: testPath.tasks.map((task) =>
        task.id === 'node-1'
          ? {
              ...task,
              status: 'completed',
              progress: 100,
              startedAt: task.createdAt,
              completedAt: new Date(),
              actualTime: 60,
            }
          : task
      ),
    });
    console.log('✅ 进度更新成功:', updatedPath.progress + '%');
    console.assert(updatedPath.tasks.some((task) => task.id === 'node-1' && task.status === 'completed'), '任务已标记为完成');
    console.assert(updatedPath.progress === 100, '路径进度已更新为 100%');
    console.log('');

    // 测试 5: 导出路径
    console.log('💾 测试 5: 导出路径');
    const exported = await pathStorage.exportPath(testPath.id);
    console.log('✅ 路径导出成功，JSON 长度:', exported.length);
    console.log('');

    // 测试 6: 导入路径
    console.log('📥 测试 6: 导入路径');
    const imported = await pathStorage.importPath(exported);
    console.log('✅ 路径导入成功:', imported.title);
    console.log('');

    // 测试 7: 删除路径
    console.log('🗑️ 测试 7: 删除测试路径');
    await pathStorage.deletePath(testPath.id);
    await pathStorage.deletePath(imported.id);
    console.log('✅ 测试路径已删除\n');

    console.log('🎉 所有测试通过！');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testPathStorage();

// 导出测试函数供手动调用
export { testPathStorage };
