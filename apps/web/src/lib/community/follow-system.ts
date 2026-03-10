// 关注系统

import { getFollows, getFollowers, getFollowing, isFollowing, toggleFollow } from './post-storage'
import type { UserProfile } from './types'

export function getUserProfile(userId: string, currentUserId: string): UserProfile {
  const followers = getFollowers(userId)
  const following = getFollowing(userId)
  const isCurrentUserFollowing = isFollowing(currentUserId, userId)
  const isMutual = isCurrentUserFollowing && isFollowing(userId, currentUserId)

  return {
    userId,
    userName: `用户${userId}`,
    followerCount: followers.length,
    followingCount: following.length,
    postCount: 0, // 需要从 posts 中计算
    isFollowing: isCurrentUserFollowing,
    isMutualFollow: isMutual,
  }
}

export function getRecommendedUsers(currentUserId: string, limit: number = 10): UserProfile[] {
  // 简单推荐算法：推荐关注者的关注者（二度关系）
  const following = getFollowing(currentUserId)
  const recommendations = new Set<string>()

  following.forEach(userId => {
    const secondDegree = getFollowing(userId)
    secondDegree.forEach(id => {
      if (id !== currentUserId && !following.includes(id)) {
        recommendations.add(id)
      }
    })
  })

  return Array.from(recommendations)
    .slice(0, limit)
    .map(userId => getUserProfile(userId, currentUserId))
}

export function followUser(followerId: string, followingId: string): boolean {
  if (followerId === followingId) return false
  return toggleFollow(followerId, followingId)
}

export function unfollowUser(followerId: string, followingId: string): boolean {
  return toggleFollow(followerId, followingId)
}

export function getFollowersList(userId: string, currentUserId: string): UserProfile[] {
  const followers = getFollowers(userId)
  return followers.map(id => getUserProfile(id, currentUserId))
}

export function getFollowingList(userId: string, currentUserId: string): UserProfile[] {
  const following = getFollowing(userId)
  return following.map(id => getUserProfile(id, currentUserId))
}

export function getMutualFollows(userId: string): string[] {
  const followers = getFollowers(userId)
  const following = getFollowing(userId)
  return followers.filter(id => following.includes(id))
}
