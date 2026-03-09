/**
 * 冲突解决器
 * 检测和解决多设备编辑时的保存冲突
 */

/**
 * 冲突数据
 */
export interface ConflictData<T> {
  local: {
    data: T;
    version: number;
    timestamp: number;
  };
  remote: {
    data: T;
    version: number;
    timestamp: number;
  };
}

/**
 * 冲突解决策略
 */
export type ConflictResolution = 'use-local' | 'use-remote' | 'merge' | 'manual';

/**
 * 冲突解决结果
 */
export interface ConflictResolutionResult<T> {
  resolved: boolean;
  data: T;
  strategy: ConflictResolution;
  message?: string;
}

/**
 * 检测是否存在冲突
 *
 * @param localVersion - 本地版本号
 * @param remoteVersion - 远程版本号
 * @returns 是否存在冲突
 *
 * @example
 * const hasConflict = detectConflict(localDoc.version, remoteDoc.version);
 */
export function detectConflict(
  localVersion: number,
  remoteVersion: number
): boolean {
  return localVersion !== remoteVersion;
}

/**
 * 自动解决冲突
 *
 * @param conflict - 冲突数据
 * @param strategy - 解决策略
 * @returns 解决后的数据
 *
 * @example
 * const result = await resolveConflict(conflict, 'use-local');
 */
export async function resolveConflict<T>(
  conflict: ConflictData<T>,
  strategy: ConflictResolution
): Promise<ConflictResolutionResult<T>> {
  switch (strategy) {
    case 'use-local':
      return {
        resolved: true,
        data: conflict.local.data,
        strategy: 'use-local',
        message: '使用本地版本',
      };

    case 'use-remote':
      return {
        resolved: true,
        data: conflict.remote.data,
        strategy: 'use-remote',
        message: '使用远程版本',
      };

    case 'merge':
      // 简单合并策略：使用时间戳较新的版本
      const useLocal = conflict.local.timestamp > conflict.remote.timestamp;
      return {
        resolved: true,
        data: useLocal ? conflict.local.data : conflict.remote.data,
        strategy: 'merge',
        message: useLocal
          ? '自动合并：使用本地版本（更新）'
          : '自动合并：使用远程版本（更新）',
      };

    case 'manual':
      return {
        resolved: false,
        data: conflict.local.data,
        strategy: 'manual',
        message: '需要手动解决冲突',
      };

    default:
      throw new Error(`Unknown resolution strategy: ${strategy}`);
  }
}

/**
 * 智能合并文档内容
 * 尝试合并两个版本的文档内容
 *
 * @param localContent - 本地内容
 * @param remoteContent - 远程内容
 * @returns 合并后的内容
 */
export function mergeDocumentContent(
  localContent: string,
  remoteContent: string
): string {
  // 如果内容相同，直接返回
  if (localContent === remoteContent) {
    return localContent;
  }

  // 简单策略：如果本地内容更长，使用本地内容
  // 实际应用中可以使用更复杂的 diff 算法
  if (localContent.length > remoteContent.length) {
    return localContent;
  }

  return remoteContent;
}

/**
 * 创建冲突标记内容
 * 当无法自动合并时，创建包含冲突标记的内容
 *
 * @param localContent - 本地内容
 * @param remoteContent - 远程内容
 * @returns 包含冲突标记的内容
 */
export function createConflictMarkers(
  localContent: string,
  remoteContent: string
): string {
  return `<<<<<<< 本地版本
${localContent}
=======
${remoteContent}
>>>>>>> 远程版本`;
}

/**
 * 冲突解决器类
 * 提供更高级的冲突检测和解决功能
 */
export class ConflictResolver<T> {
  /**
   * 检测并解决冲突
   *
   * @param local - 本地数据
   * @param remote - 远程数据
   * @param autoResolve - 是否自动解决
   * @returns 解决结果
   */
  async detectAndResolve(
    local: { data: T; version: number; timestamp: number },
    remote: { data: T; version: number; timestamp: number },
    autoResolve: boolean = true
  ): Promise<ConflictResolutionResult<T>> {
    // 检测冲突
    const hasConflict = detectConflict(local.version, remote.version);

    if (!hasConflict) {
      return {
        resolved: true,
        data: local.data,
        strategy: 'use-local',
        message: '无冲突',
      };
    }

    // 如果不自动解决，返回需要手动处理
    if (!autoResolve) {
      return {
        resolved: false,
        data: local.data,
        strategy: 'manual',
        message: '检测到冲突，需要手动解决',
      };
    }

    // 自动解决：使用时间戳较新的版本
    return await resolveConflict(
      { local, remote },
      'merge'
    );
  }

  /**
   * 批量检测冲突
   *
   * @param items - 待检测的项目列表
   * @returns 存在冲突的项目列表
   */
  async batchDetect(
    items: Array<{
      id: string;
      local: { version: number };
      remote: { version: number };
    }>
  ): Promise<string[]> {
    const conflicts: string[] = [];

    for (const item of items) {
      if (detectConflict(item.local.version, item.remote.version)) {
        conflicts.push(item.id);
      }
    }

    return conflicts;
  }
}

/**
 * 创建冲突解决器实例
 */
export function createConflictResolver<T>(): ConflictResolver<T> {
  return new ConflictResolver<T>();
}
