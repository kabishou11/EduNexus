'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Users, Download, Play, Search, Sparkles, TrendingUp } from 'lucide-react';
import { pathTemplates } from '@/lib/path/path-templates';
import { PathTemplate, LearningPath } from '@/lib/path/path-types';
import { savePath } from '@/lib/path/path-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface LearningPathMarketProps {
  onSelectTemplate?: (path: LearningPath) => void;
  onStartPath?: (path: LearningPath) => void;
}

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  matchScore: number;
  estimatedDays: number;
}

export default function LearningPathMarket({
  onSelectTemplate,
  onStartPath,
}: LearningPathMarketProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showRecommendDialog, setShowRecommendDialog] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // AI 推荐表单状态
  const [recommendForm, setRecommendForm] = useState({
    goal: '',
    currentLevel: 'beginner',
    interests: '',
    timeAvailable: 30,
  });

  const categories = Array.from(new Set(pathTemplates.map((t) => t.category)));

  const filteredTemplates = pathTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleCloneTemplate = async (template: PathTemplate) => {
    const newPath: LearningPath = {
      ...template.path,
      id: `path-${Date.now()}`,
      title: `${template.title}（副本）`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePath(newPath);
    onSelectTemplate?.(newPath);
  };

  const handleStartPath = async (template: PathTemplate) => {
    const newPath: LearningPath = {
      ...template.path,
      id: `path-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePath(newPath);
    onStartPath?.(newPath);
  };

  const handleGetRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const response = await fetch('/api/path/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: recommendForm.goal,
          currentLevel: recommendForm.currentLevel,
          interests: recommendForm.interests.split(',').map(s => s.trim()).filter(Boolean),
          timeAvailable: recommendForm.timeAvailable,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.data.recommendations);
      } else {
        alert('获取推荐失败：' + data.error.message);
      }
    } catch (error) {
      alert('获取推荐失败：' + (error as Error).message);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleApplyRecommendation = (rec: Recommendation) => {
    const template = pathTemplates.find(t => t.id === rec.id);
    if (template) {
      handleStartPath(template);
      setShowRecommendDialog(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">学习路径市场</h1>
            <p className="text-gray-600 mt-1">
              探索精心设计的学习路径，或克隆模板创建你自己的路径
            </p>
          </div>
          <Button
            onClick={() => setShowRecommendDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 智能推荐
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索路径、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="选择难度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有难度</SelectItem>
              <SelectItem value="beginner">初级</SelectItem>
              <SelectItem value="intermediate">中级</SelectItem>
              <SelectItem value="advanced">高级</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge
                  variant={
                    template.difficulty === 'beginner'
                      ? 'default'
                      : template.difficulty === 'intermediate'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {template.difficulty === 'beginner' && '初级'}
                  {template.difficulty === 'intermediate' && '中级'}
                  {template.difficulty === 'advanced' && '高级'}
                </Badge>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <CardTitle className="text-xl">{template.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(template.estimatedDuration / 60)}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{template.path.nodes.length} 节点</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleStartPath(template)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  开始学习
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCloneTemplate(template)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>没有找到匹配的学习路径</p>
          <p className="text-sm mt-2">尝试调整搜索条件或筛选器</p>
        </div>
      )}

      {/* AI 推荐对话框 */}
      <Dialog open={showRecommendDialog} onOpenChange={setShowRecommendDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI 智能路径推荐
            </DialogTitle>
            <DialogDescription>
              告诉我们你的学习目标，我们将为你推荐最合适的学习路径
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal">学习目标 *</Label>
              <Input
                id="goal"
                placeholder="例如：成为前端工程师、学习 Python、准备技术面试"
                value={recommendForm.goal}
                onChange={(e) =>
                  setRecommendForm({ ...recommendForm, goal: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">当前水平</Label>
              <Select
                value={recommendForm.currentLevel}
                onValueChange={(value) =>
                  setRecommendForm({ ...recommendForm, currentLevel: value })
                }
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">初学者</SelectItem>
                  <SelectItem value="intermediate">有一定基础</SelectItem>
                  <SelectItem value="advanced">进阶学习者</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">兴趣方向（用逗号分隔）</Label>
              <Input
                id="interests"
                placeholder="例如：前端, Python, 数据分析"
                value={recommendForm.interests}
                onChange={(e) =>
                  setRecommendForm({ ...recommendForm, interests: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">可用学习时间（天）</Label>
              <Input
                id="time"
                type="number"
                min="1"
                max="365"
                value={recommendForm.timeAvailable}
                onChange={(e) =>
                  setRecommendForm({
                    ...recommendForm,
                    timeAvailable: parseInt(e.target.value) || 30,
                  })
                }
              />
            </div>

            {recommendations.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  为你推荐以下学习路径：
                </div>
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              匹配度 {rec.matchScore}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{rec.reason}</p>
                          <p className="text-xs text-gray-500">
                            预计 {rec.estimatedDays} 天完成
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApplyRecommendation(rec)}
                        >
                          选择
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRecommendDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleGetRecommendations}
              disabled={!recommendForm.goal || isLoadingRecommendations}
            >
              {isLoadingRecommendations ? '生成中...' : '获取推荐'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}