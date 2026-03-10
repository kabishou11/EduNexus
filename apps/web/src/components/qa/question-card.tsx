"use client";

import Link from 'next/link';
import type { Question } from '@/lib/qa/qa-types';
import { Clock, Eye, MessageSquare, Award, CheckCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      programming: 'bg-blue-100 text-blue-700',
      math: 'bg-purple-100 text-purple-700',
      language: 'bg-green-100 text-green-700',
      science: 'bg-yellow-100 text-yellow-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getCategoryName = (category: string) => {
    const names = {
      programming: '编程',
      math: '数学',
      language: '语言',
      science: '科学',
      other: '其他'
    };
    return names[category as keyof typeof names] || '其他';
  };

  const getStatusBadge = () => {
    if (question.status === 'answered' && question.acceptedAnswerId) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          已解决
        </div>
      );
    }
    if (question.answerCount > 0) {
      return (
        <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          {question.answerCount} 个回答
        </div>
      );
    }
    return (
      <div className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
        待回答
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 30) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* 左侧统计 */}
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="flex flex-col items-center">
            <div className={`text-lg font-semibold ${question.voteCount > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
              {question.voteCount}
            </div>
            <div className="text-xs text-gray-500">投票</div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`text-lg font-semibold ${question.answerCount > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {question.answerCount}
            </div>
            <div className="text-xs text-gray-500">回答</div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Eye className="w-4 h-4" />
            <span className="text-xs">{question.viewCount}</span>
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          {/* 标题和状态 */}
          <div className="flex items-start gap-2 mb-2">
            <Link
              href={`/qa/${question.questionId}`}
              className="flex-1 text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
            >
              {question.title}
            </Link>
            {getStatusBadge()}
          </div>

          {/* 内容预览 */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {question.content.replace(/[#*`\[\]]/g, '').substring(0, 150)}...
          </p>

          {/* 标签和元信息 */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* 分类 */}
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(question.category)}`}>
                {getCategoryName(question.category)}
              </span>

              {/* 标签 */}
              {question.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}

              {/* 悬赏 */}
              {question.bounty > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                  <Award className="w-3 h-3" />
                  +{question.bounty}
                </div>
              )}
            </div>

            {/* 用户和时间 */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-gray-700">{question.userName}</span>
              <span>提问于</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(question.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
