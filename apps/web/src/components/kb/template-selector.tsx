"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PRESET_TEMPLATES,
  TEMPLATE_CATEGORIES,
  applyTemplate,
  type NoteTemplate,
  type TemplateCategory,
} from "@/lib/kb/templates";
import { FileText, Search, Sparkles } from "lucide-react";

type TemplateSelectorProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (title: string, content: string, tags: string[]) => void;
};

export function TemplateSelector({ open, onClose, onSelect }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [customTitle, setCustomTitle] = useState("");

  // 筛选模板
  const filteredTemplates = PRESET_TEMPLATES.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 选择模板
  const handleSelectTemplate = (template: NoteTemplate) => {
    const title = customTitle || template.name;
    const content = applyTemplate(template, { title });

    // 调用回调并关闭对话框
    onSelect(title, content, template.tags);
    onClose();

    // 重置表单状态
    setCustomTitle("");
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-950">
            <Sparkles className="w-5 h-5 text-amber-600" />
            选择笔记模板
          </DialogTitle>
          <DialogDescription>
            从预设模板快速开始，或创建空白笔记
          </DialogDescription>
        </DialogHeader>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
          <Input
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-amber-200 focus:border-amber-400"
          />
        </div>

        {/* 自定义标题 */}
        <div>
          <Input
            placeholder="自定义笔记标题（可选）"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="border-amber-200 focus:border-amber-400"
          />
        </div>

        {/* 分类标签 */}
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as TemplateCategory | "all")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="bg-amber-100/50 w-full justify-start">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <span>全部</span>
            </TabsTrigger>
            {TEMPLATE_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-1"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value={selectedCategory}
            className="flex-1 overflow-y-auto mt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group p-4 rounded-lg border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-amber-950 mb-1 group-hover:text-amber-700">
                        {template.name}
                      </h3>
                      <p className="text-sm text-amber-600 mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-amber-300 mb-3" />
                <p className="text-amber-600">未找到匹配的模板</p>
                <p className="text-sm text-amber-500 mt-1">
                  尝试调整搜索条件或选择其他分类
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-amber-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-amber-300 hover:bg-amber-50"
          >
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
