/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type StoredValue = Record<string, any>;

function createGoal(id: string) {
  const now = new Date().toISOString();
  return {
    id,
    title: `目标 ${id}`,
    description: '测试目标',
    type: 'mid-term' as const,
    category: 'skill' as const,
    status: 'active' as const,
    smart: {
      specific: 'specific',
      measurable: 'measurable',
      achievable: 'achievable',
      relevant: 'relevant',
      timeBound: 'timeBound',
    },
    progress: 0,
    linkedPathIds: [] as string[],
    relatedKnowledge: [],
    startDate: now,
    endDate: now,
    createdAt: now,
    updatedAt: now,
  };
}

function createImportJson(goalId?: string) {
  return JSON.stringify({
    title: '导入路径',
    description: '导入描述',
    status: 'not_started',
    progress: 0,
    tags: ['import'],
    goalId,
    tasks: [],
    milestones: [],
  });
}

describe('path-storage goal linkage', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    const syncModule = await import('@/lib/sync/data-sync-events');
    syncModule.getDataSyncEventManager().clear();
  });

  async function setup(options?: { failOpenDb?: boolean }) {
    const store = new Map<string, StoredValue>();

    vi.doMock('idb', () => ({
      openDB: options?.failOpenDb
        ? vi.fn(async () => {
            throw new Error('openDB failed');
          })
        : vi.fn(async () => ({
            getAll: async () => Array.from(store.values()),
            get: async (_table: string, key: string) => store.get(key),
            put: async (_table: string, value: StoredValue) => {
              store.set(value.id, value);
              return value.id;
            },
            delete: async (_table: string, key: string) => {
              store.delete(key);
            },
          })),
    }));

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    );

    const pathModule = await import('@/lib/client/path-storage');
    const goalsModule = await import('@/lib/goals/goal-storage');

    return {
      pathStorage: pathModule.pathStorage,
      goalStorage: goalsModule.goalStorage,
      store,
    };
  }

  it('creates path and links goal when goalId is provided', async () => {
    const { pathStorage, goalStorage } = await setup();
    goalStorage.saveGoal(createGoal('goal-create'));

    const created = await pathStorage.createPath({
      title: '创建路径',
      description: '描述',
      goalId: 'goal-create',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });

    const savedGoal = goalStorage.getGoals().find((goal) => goal.id === 'goal-create');
    expect(created.goalId).toBe('goal-create');
    expect(savedGoal?.linkedPathIds).toContain(created.id);
  });

  it('updates goal linkage when editing path goalId', async () => {
    const { pathStorage, goalStorage } = await setup();
    goalStorage.saveGoal(createGoal('goal-a'));
    goalStorage.saveGoal(createGoal('goal-b'));

    const created = await pathStorage.createPath({
      title: '编辑路径',
      description: '描述',
      goalId: 'goal-a',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });

    const moved = await pathStorage.updatePath(created.id, { goalId: 'goal-b' });
    const cleared = await pathStorage.updatePath(created.id, { goalId: undefined });
    const goalA = goalStorage.getGoals().find((goal) => goal.id === 'goal-a');
    const goalB = goalStorage.getGoals().find((goal) => goal.id === 'goal-b');

    expect(moved.goalId).toBe('goal-b');
    expect(goalA?.linkedPathIds).not.toContain(created.id);
    expect(goalB?.linkedPathIds).not.toContain(created.id);
    expect(cleared.goalId).toBeUndefined();
  });

  it('duplicates path and links duplicate to the same goal', async () => {
    const { pathStorage, goalStorage } = await setup();
    goalStorage.saveGoal(createGoal('goal-duplicate'));

    const created = await pathStorage.createPath({
      title: '原路径',
      description: '描述',
      goalId: 'goal-duplicate',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });

    const duplicate = await pathStorage.duplicatePath(created.id);
    const goal = goalStorage.getGoals().find((item) => item.id === 'goal-duplicate');

    expect(duplicate.goalId).toBe('goal-duplicate');
    expect(goal?.linkedPathIds).toEqual(expect.arrayContaining([created.id, duplicate.id]));
  });

  it('imports path and links imported path to the referenced goal', async () => {
    const { pathStorage, goalStorage } = await setup();
    goalStorage.saveGoal(createGoal('goal-import'));

    await pathStorage.createPath({
      title: '预热初始化',
      description: '描述',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });

    const imported = await pathStorage.importPath(createImportJson('goal-import'));
    const goal = goalStorage.getGoals().find((item) => item.id === 'goal-import');

    expect(imported.goalId).toBe('goal-import');
    expect(goal?.linkedPathIds).toContain(imported.id);
  });

  it('deletes path and removes linked path id from goals', async () => {
    const { pathStorage, goalStorage } = await setup();
    goalStorage.saveGoal(createGoal('goal-delete'));

    const created = await pathStorage.createPath({
      title: '待删除路径',
      description: '描述',
      goalId: 'goal-delete',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });

    await pathStorage.deletePath(created.id);
    const goal = goalStorage.getGoals().find((item) => item.id === 'goal-delete');

    expect(goal?.linkedPathIds).not.toContain(created.id);
  });

  it('creates path and links goal in LocalStorage fallback mode', async () => {
    const { pathStorage, goalStorage } = await setup({ failOpenDb: true });
    goalStorage.saveGoal(createGoal('goal-fallback-create'));

    const created = await pathStorage.createPath({
      title: 'fallback 创建',
      description: '描述',
      goalId: 'goal-fallback-create',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });

    const goal = goalStorage.getGoals().find((item) => item.id === 'goal-fallback-create');
    const storedPaths = await pathStorage.getAllPaths();

    expect(created.goalId).toBe('goal-fallback-create');
    expect(storedPaths.some((path) => path.id === created.id)).toBe(true);
    expect(goal?.linkedPathIds).toContain(created.id);
  });

  it('duplicates and imports linked paths in LocalStorage fallback mode', async () => {
    const { pathStorage, goalStorage } = await setup({ failOpenDb: true });
    goalStorage.saveGoal(createGoal('goal-fallback-copy'));
    goalStorage.saveGoal(createGoal('goal-fallback-import'));

    const created = await pathStorage.createPath({
      title: 'fallback 原路径',
      description: '描述',
      goalId: 'goal-fallback-copy',
      status: 'not_started',
      progress: 0,
      tags: [],
      tasks: [],
      milestones: [],
    });
    const duplicate = await pathStorage.duplicatePath(created.id);
    const imported = await pathStorage.importPath(createImportJson('goal-fallback-import'));

    const copyGoal = goalStorage.getGoals().find((item) => item.id === 'goal-fallback-copy');
    const importGoal = goalStorage.getGoals().find((item) => item.id === 'goal-fallback-import');

    expect(copyGoal?.linkedPathIds).toEqual(expect.arrayContaining([created.id, duplicate.id]));
    expect(importGoal?.linkedPathIds).toContain(imported.id);
  });
});
