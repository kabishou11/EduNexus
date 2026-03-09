/**
 * 用户等级系统测试脚本
 *
 * 运行方式：
 * node apps/web/scripts/test-user-level.mjs
 */

const BASE_URL = 'http://localhost:3000';
const USER_ID = 'demo_user';

async function testUserLevelSystem() {
  console.log('🎮 开始测试用户等级系统...\n');

  try {
    // 1. 获取初始等级信息
    console.log('1️⃣ 获取用户等级信息...');
    const levelRes = await fetch(`${BASE_URL}/api/user/level?userId=${USER_ID}`);
    const levelData = await levelRes.json();

    if (levelData.success) {
      const { level, experience, stats } = levelData.data;
      console.log(`   ✅ 当前等级: Lv ${level.level} ${level.titleEmoji} ${level.title}`);
      console.log(`   📊 总经验值: ${level.totalExp}`);
      console.log(`   📈 学习时长: ${(stats.learningMinutes / 60).toFixed(1)} 小时\n`);
    } else {
      console.error('   ❌ 获取等级失败:', levelData.error);
      return;
    }

    // 2. 模拟学习行为，添加经验值
    console.log('2️⃣ 模拟学习行为...');

    const actions = [
      { type: 'learning_minute', count: 30, desc: '学习 30 分钟' },
      { type: 'create_note', count: 3, desc: '创建 3 篇笔记' },
      { type: 'practice_correct', count: 10, desc: '完成 10 道练习题（正确）' },
      { type: 'master_knowledge', count: 2, desc: '掌握 2 个知识点' },
      { type: 'post', count: 1, desc: '发布 1 篇动态' }
    ];

    let totalExpGained = 0;
    let levelUps = 0;
    let badgesUnlocked = [];

    for (const action of actions) {
      console.log(`   🎯 ${action.desc}...`);

      for (let i = 0; i < action.count; i++) {
        const res = await fetch(`${BASE_URL}/api/user/experience/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: USER_ID,
            eventType: action.type
          })
        });

        const result = await res.json();

        if (result.success) {
          totalExpGained += result.data.expGained;

          if (result.data.levelUp) {
            levelUps++;
            console.log(`      🎉 等级提升！达到 Lv ${result.data.newLevel}`);
          }

          if (result.data.unlockedBadges && result.data.unlockedBadges.length > 0) {
            badgesUnlocked.push(...result.data.unlockedBadges);
            console.log(`      🏆 解锁徽章: ${result.data.unlockedBadges.join(', ')}`);
          }
        }
      }
    }

    console.log(`\n   ✅ 总共获得 ${totalExpGained} 经验值`);
    if (levelUps > 0) {
      console.log(`   🎊 等级提升 ${levelUps} 次`);
    }
    if (badgesUnlocked.length > 0) {
      console.log(`   🏅 解锁 ${badgesUnlocked.length} 个徽章\n`);
    }

    // 3. 获取更新后的等级信息
    console.log('3️⃣ 获取更新后的等级信息...');
    const updatedLevelRes = await fetch(`${BASE_URL}/api/user/level?userId=${USER_ID}`);
    const updatedLevelData = await updatedLevelRes.json();

    if (updatedLevelData.success) {
      const { level, nextLevel } = updatedLevelData.data;
      console.log(`   ✅ 当前等级: Lv ${level.level} ${level.titleEmoji} ${level.title}`);
      console.log(`   📊 总经验值: ${level.totalExp}`);

      if (nextLevel) {
        console.log(`   🎯 距离下一级: ${nextLevel.expNeeded} EXP (${nextLevel.progressPercent.toFixed(1)}%)`);
        console.log(`   🔜 下一级: Lv ${nextLevel.level} ${nextLevel.titleEmoji} ${nextLevel.title}\n`);
      }
    }

    // 4. 获取成就和徽章
    console.log('4️⃣ 获取成就和徽章...');
    const achievementsRes = await fetch(`${BASE_URL}/api/user/achievements?userId=${USER_ID}`);
    const achievementsData = await achievementsRes.json();

    if (achievementsData.success) {
      const { stats, badges } = achievementsData.data;
      console.log(`   ✅ 已解锁徽章: ${stats.unlocked} / ${stats.total} (${stats.progress.toFixed(1)}%)`);

      const unlockedBadges = badges.filter(b => b.isUnlocked);
      if (unlockedBadges.length > 0) {
        console.log('   🏆 已解锁的徽章:');
        unlockedBadges.forEach(badge => {
          console.log(`      ${badge.emoji} ${badge.name} - ${badge.description}`);
        });
      }

      const inProgressBadges = badges
        .filter(b => !b.isUnlocked && b.progress > 0)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);

      if (inProgressBadges.length > 0) {
        console.log('\n   📈 进行中的徽章 (前3个):');
        inProgressBadges.forEach(badge => {
          console.log(`      ${badge.emoji} ${badge.name} - ${badge.progress.toFixed(0)}%`);
        });
      }
    }

    console.log('\n✅ 测试完成！');
    console.log('\n💡 提示: 访问 http://localhost:3000/user-level 查看完整的等级页面');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('\n💡 请确保开发服务器正在运行: pnpm dev');
  }
}

// 运行测试
testUserLevelSystem();
