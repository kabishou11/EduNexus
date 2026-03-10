"use client";

import { useState } from 'react';
import type { Answer } from '@/lib/qa/qa-types';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { VoteButtons } from './vote-buttons';
import { CheckCircle, MessageSquare, Clock } from 'lucide-react';
import { acceptAnswer, getCommentsByTargetId, createComment } from '@/lib/qa/qa-storage';

interface AnswerListProps {
  answers: Answer[];
  questionUserId: string;
  currentUserId: string;
  questionId: string;
  onAnswerAccepted?: () => void;
}

export function AnswerList({
  answers,
  questionUserId,
  currentUserId,
  questionId,
  onAnswerAccepted
}: AnswerListProps) {
  const [localAnswers, setLocalAnswers] = useState(answers);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const handleAcceptAnswer = (answerId: string) => {
    const success = acceptAnswer(questionId, answerId, currentUserId);
    if (success) {
      setLocalAnswers(prev =>
        prev.map(a => ({
          ...a,
          isAccepted: a.answerId === answerId
        }))
      );
      onAnswerAccepted?.();
    }
  };

  const handleAddComment = (answerId: string) => {
    const text = commentText[answerId]?.trim();
    if (!text) return;

    createComment({
      targetId: answerId,
      targetType: 'answer',
      userId: currentUserId,
      userName: '当前用户',
      content: text
    });

    setCommentText(prev => ({ ...prev, [answerId]: '' }));
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

  if (localAnswers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">还没有回答，来抢沙发吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {localAnswers.map(answer => {
        const comments = getCommentsByTargetId(answer.answerId);
        const isCommentsVisible = showComments[answer.answerId];

        return (
          <div
            key={answer.answerId}
            className={`bg-white rounded-lg border-2 p-6 ${
              answer.isAccepted
                ? 'border-green-300 bg-green-50/30'
                : 'border-gray-200'
            }`}
          >
            {/* 采纳标记 */}
            {answer.isAccepted && (
              <div className="flex items-center gap-2 mb-4 text-green-700 font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>最佳答案</span>
              </div>
            )}

            <div className="flex gap-4">
              {/* 投票按钮 */}
              <div className="flex-shrink-0">
                <VoteButtons
                  targetId={answer.answerId}
                  targetType="answer"
                  initialVoteCount={answer.voteCount}
                  userId={currentUserId}
                  vertical={true}
                />

                {/* 采纳按钮 */}
                {!answer.isAccepted &&
                  questionUserId === currentUserId &&
                  currentUserId !== answer.userId && (
                    <button
                      onClick={() => handleAcceptAnswer(answer.answerId)}
                      className="mt-2 p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="采纳为最佳答案"
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  )}
              </div>

              {/* 答案内容 */}
              <div className="flex-1 min-w-0">
                <MarkdownRenderer content={answer.content} />

                {/* 答案元信息 */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setShowComments(prev => ({
                        ...prev,
                        [answer.answerId]: !prev[answer.answerId]
                      }))
                    }
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {comments.length > 0
                        ? `${comments.length} 条评论`
                        : '添加评论'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {answer.userName}
                    </span>
                    <span>回答于</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(answer.createdAt)}
                    </div>
                  </div>
                </div>

                {/* 评论区 */}
                {isCommentsVisible && (
                  <div className="mt-4 space-y-3">
                    {comments.map(comment => (
                      <div
                        key={comment.commentId}
                        className="bg-gray-50 rounded p-3 text-sm"
                      >
                        <p className="text-gray-700">{comment.content}</p>
                        <div className="mt-1 text-xs text-gray-500">
                          <span className="font-medium text-gray-700">
                            {comment.userName}
                          </span>
                          {' · '}
                          {formatTime(comment.createdAt)}
                        </div>
                      </div>
                    ))}

                    {/* 添加评论 */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText[answer.answerId] || ''}
                        onChange={e =>
                          setCommentText(prev => ({
                            ...prev,
                            [answer.answerId]: e.target.value
                          }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleAddComment(answer.answerId);
                          }
                        }}
                        placeholder="添加评论..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(answer.answerId)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
