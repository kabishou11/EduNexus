"use client";

import React, { useState, useCallback, memo } from 'react';
import { Plus, FileText, Sparkles, FileCode, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * 创建选项类型
 */
interface CreateOption {
  id: string;
  icon: typeof FileText;
  label: string;
  color: string;
  description: string;
}

/**
 * 浮动创建按钮属性
 */
interface FloatingCreateButtonProps {
  onCreateBlank?: () => void;
  onCreateFromTemplate?: () => void;
  onQuickNote?: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * 浮动创建按钮组件
 *
 * 提供快速创建笔记的浮动按钮，支持多种创建方式
 */
export const FloatingCreateButton = memo(function FloatingCreateButton({
  onCreateBlank,
  onCreateFromTemplate,
  onQuickNote,
  className,
  position = 'bottom-right',
}: FloatingCreateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 创建选项配置
  const options: CreateOption[] = [
    {
      id: 'blank',
      icon: FileText,
      label: '空白笔记',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '创建一个空白笔记',
    },
    {
      id: 'template',
      icon: FileCode,
      label: '使用模板',
      color: 'bg-green-500 hover:bg-green-600',
      description: '从模板快速创建',
    },
    {
      id: 'quick',
      icon: Zap,
      label: '快速记录',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '快速记录想法',
    },
  ];

  // 处理创建操作
  const handleCreate = useCallback((type: string) => {
    setIsOpen(false);

    switch (type) {
      case 'blank':
        onCreateBlank?.();
        break;
      case 'template':
        onCreateFromTemplate?.();
        break;
      case 'quick':
        onQuickNote?.();
        break;
      default:
        // 触发自定义事件，供其他组件监听
        window.dispatchEvent(
          new CustomEvent('kb:quick-create', { detail: { type } })
        );
    }
  }, [onCreateBlank, onCreateFromTemplate, onQuickNote]);

  // 切换菜单
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // 位置样式映射
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <TooltipProvider>
      <div className={cn('fixed z-50', positionStyles[position], className)}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="mb-2 space-y-2"
            >
              {options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.15 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleCreate(option.id)}
                        className={cn(
                          'w-full justify-start gap-2 text-white shadow-lg min-w-[160px]',
                          option.color
                        )}
                        size="sm"
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {option.description}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              onClick={toggleMenu}
              className={cn(
                'rounded-full w-14 h-14 shadow-lg transition-all duration-200',
                'bg-gradient-to-r from-amber-500 to-orange-500',
                'hover:from-amber-600 hover:to-orange-600',
                'hover:scale-110',
                isOpen && 'rotate-45'
              )}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isOpen ? '关闭菜单' : '快速创建'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
});
