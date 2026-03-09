/**
 * 路径市场组件 - 浏览和选择技能树模板
 */

'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  Download,
  TrendingUp,
  Clock,
  Target,
  Users,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SkillTreeTemplate } from '@/lib/path/skill-tree-types';
import { cn } from '@/lib/utils';

type PathMarketProps = {
  onSelectTemplate?: (template: SkillTreeTemplate) => void;
};

// 模拟模板数据
const mockTemplates: SkillTreeTemplate[] = [
  {
    id: 'frontend-fullstack',
    title: '前端开发全栈',
    description: '从零基础到全栈前端工程师的完整学习路径',
    category: 'frontend',
    preview: '/templates/frontend.png',
    nodes: [],
    edges: [],
    estimatedDuration: 240,
    difficulty: 'intermediate',
    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    author: 'EduNexus Team',
    rating: 4.8,
    downloads: 15234,
    createdAt: '2026-01-15',
  },
  {
    id: 'python-data-science',
    title: 'Python 数据科学',
    description: '掌握 Python 数据分析和机器学习的核心技能',
    category: 'data-science',
    preview: '/templates/python-ds.png',
    nodes: [],
    edges: [],
    estimatedDuration: 180,
    difficulty: 'intermediate',
    tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
    author: 'Data Science Pro',
    rating: 4.9,
    downloads: 12890,
    createdAt: '2026-02-01',
  },
  {
    id: 'ml-beginner',
    title: '机器学习入门',
    description: '适合初学者的机器学习基础课程',
    category: 'machine-learning',
    preview: '/templates/ml.png',
    nodes: [],
    edges: [],
    estimatedDuration: 120,
    difficulty: 'beginner',
    tags: ['机器学习', 'Python', 'TensorFlow'],
    author: 'AI Academy',
    rating: 4.7,
    downloads: 9876,
    createdAt: '2026-01-20',
  },
  {
    id: 'algorithms-ds',
    title: '算法与数据结构',
    description: '系统学习常用算法和数据结构',
    category: 'algorithms',
    preview: '/templates/algo.png',
    nodes: [],
    edges: [],
    estimatedDuration: 200,
    difficulty: 'advanced',
    tags: ['算法', '数据结构', 'LeetCode'],
    author: 'Code Master',
    rating: 4.9,
    downloads: 18765,
    createdAt: '2026-01-10',
  },
];

export default function PathMarket({ onSelectTemplate }: PathMarketProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredTemplates = mockTemplates
    .filter((template) => {
      if (searchQuery && !template.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (categoryFilter !== 'all' && template.category !== categoryFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && template.difficulty !== difficultyFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    advanced: 'bg-purple-100 text-purple-700 border-purple-200',
    expert: 'bg-red-100 text-red-700 border-red-200',
  };

  const difficultyLabels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
    expert: '专家',
  };

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索技能树模板..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">最受欢迎</SelectItem>
              <SelectItem value="rating">评分最高</SelectItem>
              <SelectItem value="newest">最新发布</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="frontend">前端开发</SelectItem>
              <SelectItem value="backend">后端开发</SelectItem>
              <SelectItem value="data-science">数据科学</SelectItem>
              <SelectItem value="machine-learning">机器学习</SelectItem>
              <SelectItem value="algorithms">算法</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="难度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部难度</SelectItem>
              <SelectItem value="beginner">入门</SelectItem>
              <SelectItem value="intermediate">进阶</SelectItem>
              <SelectItem value="advanced">高级</SelectItem>
              <SelectItem value="expert">专家</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => onSelectTemplate?.(template)}
          >
            {/* 预览图 */}
            <div className="relative h-48 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-orange-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4">
                <Badge className={difficultyColors[template.difficulty]}>
                  {difficultyLabels[template.difficulty]}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 标签 */}
              <div className="flex flex-wrap gap-1.5">
                {template.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 4}
                  </Badge>
                )}
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{template.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">评分</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {template.downloads > 1000
                        ? `${(template.downloads / 1000).toFixed(1)}k`
                        : template.downloads}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">使用</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{template.estimatedDuration}h</span>
                  </div>
                  <p className="text-xs text-gray-600">时长</p>
                </div>
              </div>

              {/* 作者 */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <span>作者: {template.author}</span>
                <span>{new Date(template.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">未找到匹配的技能树模板</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setDifficultyFilter('all');
            }}
          >
            清除筛选条件
          </Button>
        </div>
      )}
    </div>
  );
}