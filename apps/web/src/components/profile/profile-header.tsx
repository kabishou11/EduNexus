'use client';

import { useState } from 'react';
import type { UserProfile, UserSocialStats } from '@/lib/profile/profile-types';
import type { UserLevel } from '@/lib/server/user-level-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ProfileHeaderProps = {
  profile: UserProfile;
  socialStats: UserSocialStats;
  userLevel: UserLevel;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onEditProfile?: () => void;
};

export function ProfileHeader({
  profile,
  socialStats,
  userLevel,
  isOwnProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  onEditProfile
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const themeColors = {
    default: 'from-gray-500 to-gray-700',
    dark: 'from-gray-800 to-black',
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    purple: 'from-purple-500 to-purple-700'
  };

  const gradientClass = themeColors[profile.theme || 'default'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* 封面图片 */}
      <div className={`h-48 bg-gradient-to-r ${gradientClass} relative`}>
        {profile.coverImage && !imageError ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : null}
      </div>

      {/* 个人信息 */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
          {/* 头像和基本信息 */}
          <div className="flex items-end space-x-4">
            <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center text-6xl shadow-lg">
              {profile.avatar || '👤'}
            </div>

            <div className="mb-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.displayName}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  {userLevel.titleEmoji} {userLevel.title}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
              {profile.signature && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {profile.signature}
                </p>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-2 mt-4 md:mt-0">
            {isOwnProfile ? (
              <Button onClick={onEditProfile} variant="outline">
                编辑资料
              </Button>
            ) : (
              <>
                {isFollowing ? (
                  <Button onClick={onUnfollow} variant="outline">
                    已关注
                  </Button>
                ) : (
                  <Button onClick={onFollow}>
                    关注
                  </Button>
                )}
                <Button variant="outline">
                  发消息
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex flex-wrap gap-6 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900 dark:text-white">
              {socialStats.followingCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400">关注</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900 dark:text-white">
              {socialStats.followersCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400">粉丝</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900 dark:text-white">
              {socialStats.likesReceived}
            </span>
            <span className="text-gray-600 dark:text-gray-400">获赞</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900 dark:text-white">
              {socialStats.reputation}
            </span>
            <span className="text-gray-600 dark:text-gray-400">声誉</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900 dark:text-white">
              {socialStats.contributionScore}
            </span>
            <span className="text-gray-600 dark:text-gray-400">贡献度</span>
          </div>
        </div>

        {/* 个人简介 */}
        {profile.bio && (
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {profile.bio}
            </p>
          </div>
        )}

        {/* 详细信息 */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          {profile.school && (
            <div className="flex items-center space-x-1">
              <span>🎓</span>
              <span>{profile.school}</span>
            </div>
          )}
          {profile.company && (
            <div className="flex items-center space-x-1">
              <span>💼</span>
              <span>{profile.company}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center space-x-1">
              <span>🔗</span>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* 社交链接 */}
        {(profile.github || profile.twitter || profile.blog) && (
          <div className="flex space-x-3 mt-4">
            {profile.github && (
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {profile.twitter && (
              <a
                href={`https://twitter.com/${profile.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            )}
            {profile.blog && (
              <a
                href={profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </a>
            )}
          </div>
        )}

        {/* 兴趣标签 */}
        {profile.interests.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
