/**
 * 离线保存服务
 * 使用 IndexedDB 缓存未保存的内容，网络恢复后自动同步
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

/**
 * 离线保存数据库结构
 */
interface OfflineSaveDB extends DBSchema {
  pendingSaves: {
    key: string;
    value: {
      id: string;
      type: 'document' | 'note';
      data: any;
      timestamp: number;
      version: number;
      retryCount: number;
    };
    indexes: { 'by-timestamp': number };
  };
}

/**
 * 待保存项
 */
export interface PendingSaveItem {
  id: string;
  type: 'document' | 'note';
  data: any;
  timestamp: number;
  version: number;
  retryCount: number;
}

/**
 * 同步结果
 */
export interface SyncResult {
  success: number;
  failed: number;
  errors: Array<{ id: string; error: Error }>;
}

/**
 * 离线保存服务类
 */
class OfflineSaveService {
  private db: IDBPDatabase<OfflineSaveDB> | null = null;
  private readonly DB_NAME = 'offline-saves';
  private readonly DB_VERSION = 1;
  private readonly MAX_RETRY_COUNT = 3;

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    if (this.db) return;

    try {
      this.db = await openDB<OfflineSaveDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('pendingSaves')) {
            const store = db.createObjectStore('pendingSaves', { keyPath: 'id' });
            store.createIndex('by-timestamp', 'timestamp');
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize offline save database:', error);
      throw error;
    }
  }

  /**
   * 保存待同步项
   *
   * @param id - 项目 ID
   * @param type - 项目类型
   * @param data - 项目数据
   * @param version - 数据版本号
   */
  async savePending(
    id: string,
    type: 'document' | 'note',
    data: any,
    version: number
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      // 检查是否已存在
      const existing = await this.db.get('pendingSaves', id);

      await this.db.put('pendingSaves', {
        id,
        type,
        data,
        timestamp: Date.now(),
        version,
        retryCount: existing?.retryCount || 0,
      });
    } catch (error) {
      console.error('Failed to save pending item:', error);
      throw error;
    }
  }

  /**
   * 获取所有待同步项
   */
  async getPending(): Promise<PendingSaveItem[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      return await this.db.getAll('pendingSaves');
    } catch (error) {
      console.error('Failed to get pending items:', error);
      throw error;
    }
  }

  /**
   * 获取待同步项数量
   */
  async getPendingCount(): Promise<number> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      return await this.db.count('pendingSaves');
    } catch (error) {
      console.error('Failed to get pending count:', error);
      return 0;
    }
  }

  /**
   * 删除待同步项
   *
   * @param id - 项目 ID
   */
  async removePending(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.delete('pendingSaves', id);
    } catch (error) {
      console.error('Failed to remove pending item:', error);
      throw error;
    }
  }

  /**
   * 增加重试次数
   *
   * @param id - 项目 ID
   */
  async incrementRetryCount(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const item = await this.db.get('pendingSaves', id);
      if (item) {
        item.retryCount += 1;
        await this.db.put('pendingSaves', item);
      }
    } catch (error) {
      console.error('Failed to increment retry count:', error);
      throw error;
    }
  }

  /**
   * 同步所有待保存项
   *
   * @param syncFn - 同步函数
   * @returns 同步结果
   */
  async syncPending(
    syncFn: (item: PendingSaveItem) => Promise<void>
  ): Promise<SyncResult> {
    const pending = await this.getPending();
    const result: SyncResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const item of pending) {
      try {
        // 检查重试次数
        if (item.retryCount >= this.MAX_RETRY_COUNT) {
          console.warn(`Item ${item.id} exceeded max retry count, skipping`);
          result.failed++;
          result.errors.push({
            id: item.id,
            error: new Error('Exceeded max retry count'),
          });
          continue;
        }

        // 执行同步
        await syncFn(item);

        // 同步成功，删除项
        await this.removePending(item.id);
        result.success++;
      } catch (error) {
        console.error(`Failed to sync ${item.id}:`, error);

        // 增加重试次数
        await this.incrementRetryCount(item.id);

        result.failed++;
        result.errors.push({
          id: item.id,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }

    return result;
  }

  /**
   * 清空所有待同步项
   */
  async clearAll(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.clear('pendingSaves');
    } catch (error) {
      console.error('Failed to clear pending items:', error);
      throw error;
    }
  }
}

// 单例实例
let serviceInstance: OfflineSaveService | null = null;

/**
 * 获取离线保存服务实例
 */
export function getOfflineSaveService(): OfflineSaveService {
  if (!serviceInstance) {
    serviceInstance = new OfflineSaveService();
  }
  return serviceInstance;
}

// 导出默认实例
export const offlineSaveService = getOfflineSaveService();
