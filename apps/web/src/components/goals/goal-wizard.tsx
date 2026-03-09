'use client';

import { useState } from 'react';
import { Goal, GoalType, GoalCategory } from '@/lib/goals/goal-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface GoalWizardProps {
  onComplete: (goal: Goal) => void;
  onCancel: () => void;
}

export function GoalWizard({ onComplete, onCancel }: GoalWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'short-term' as GoalType,
    category: 'other' as GoalCategory,
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      status: 'active',
      smart: {
        specific: formData.specific,
        measurable: formData.measurable,
        achievable: formData.achievable,
        relevant: formData.relevant,
        timeBound: formData.timeBound,
      },
      progress: 0,
      milestones: [],
      relatedKnowledge: [],
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onComplete(goal);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">目标标题</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：通过英语六级考试"
              />
            </div>
            <div>
              <Label htmlFor="description">目标描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细描述你的目标..."
                rows={3}
              />
            </div>
            <div>
              <Label>目标类型</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as GoalType })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short-term" id="short" />
                  <Label htmlFor="short">短期目标（1-3个月）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mid-term" id="mid" />
                  <Label htmlFor="mid">中期目标（3-12个月）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long-term" id="long" />
                  <Label htmlFor="long">长期目标（1年以上）</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>目标分类</Label>
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as GoalCategory })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="exam" id="exam" />
                  <Label htmlFor="exam">考试准备</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skill" id="skill" />
                  <Label htmlFor="skill">技能学习</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" />
                  <Label htmlFor="project">项目完成</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="habit" id="habit" />
                  <Label htmlFor="habit">习惯养成</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">其他</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">SMART 目标设定</h3>
              <p className="text-sm text-muted-foreground">
                让我们将你的目标转化为 SMART 目标，使其更具体、可衡量、可实现、相关且有时限。
              </p>
            </div>
            <div>
              <Label htmlFor="specific">Specific（具体的）</Label>
              <Textarea
                id="specific"
                value={formData.specific}
                onChange={(e) => setFormData({ ...formData, specific: e.target.value })}
                placeholder="你的目标具体是什么？例如：达到六级550分以上"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="measurable">Measurable（可衡量的）</Label>
              <Textarea
                id="measurable"
                value={formData.measurable}
                onChange={(e) => setFormData({ ...formData, measurable: e.target.value })}
                placeholder="如何衡量进度？例如：每周完成2套真题，词汇量达到6000"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="achievable">Achievable（可实现的）</Label>
              <Textarea
                id="achievable"
                value={formData.achievable}
                onChange={(e) => setFormData({ ...formData, achievable: e.target.value })}
                placeholder="为什么这个目标是可实现的？例如：每天投入2小时学习时间"
                rows={2}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="relevant">Relevant（相关的）</Label>
              <Textarea
                id="relevant"
                value={formData.relevant}
                onChange={(e) => setFormData({ ...formData, relevant: e.target.value })}
                placeholder="这个目标为什么重要？例如：对考研和就业都有帮助"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="timeBound">Time-bound（有时限的）</Label>
              <Textarea
                id="timeBound"
                value={formData.timeBound}
                onChange={(e) => setFormData({ ...formData, timeBound: e.target.value })}
                placeholder="完成时间？例如：2026年6月参加考试"
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">目标完成日期</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">目标摘要</h4>
              <p className="text-sm"><strong>标题：</strong>{formData.title}</p>
              <p className="text-sm"><strong>类型：</strong>{formData.type}</p>
              <p className="text-sm"><strong>分类：</strong>{formData.category}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>创建新目标</CardTitle>
        <CardDescription>
          步骤 {step} / {totalSteps}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 mx-1 rounded ${
                  i + 1 <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={step === 1 ? onCancel : handleBack}>
            {step === 1 ? '取消' : '上一步'}
          </Button>
          <Button onClick={step === totalSteps ? handleSubmit : handleNext}>
            {step === totalSteps ? '创建目标' : '下一步'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
