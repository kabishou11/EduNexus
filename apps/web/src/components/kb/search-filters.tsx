"use client";

import { useState } from "react";
import { Filter, X, Calendar, Tag, FileType, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export type SearchFilters = {
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  docTypes: string[];
  logicMode: "AND" | "OR";
};

type SearchFiltersProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  availableTags: string[];
  availableDocTypes: string[];
};

export function SearchFiltersPanel({
  filters,
  onChange,
  availableTags,
  availableDocTypes,
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: newTags });
  };

  const toggleDocType = (type: string) => {
    const newTypes = filters.docTypes.includes(type)
      ? filters.docTypes.filter((t) => t !== type)
      : [...filters.docTypes, type];
    onChange({ ...filters, docTypes: newTypes });
  };

  const clearFilters = () => {
    onChange({
      tags: [],
      docTypes: [],
      logicMode: "AND",
    });
  };

  const activeFilterCount =
    filters.tags.length +
    filters.docTypes.length +
    (filters.dateRange ? 1 : 0);

  return (
    <div className="border border-amber-200 rounded-lg bg-white/80 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">高级筛选</span>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="bg-amber-500">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="h-7 text-xs text-amber-600 hover:text-amber-800"
              >
                清除
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <Separator className="bg-amber-200" />

            {/* 逻辑模式 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-amber-900">搜索逻辑</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filters.logicMode === "AND" ? "default" : "outline"}
                  onClick={() => onChange({ ...filters, logicMode: "AND" })}
                  className={
                    filters.logicMode === "AND"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "border-amber-300 hover:bg-amber-50"
                  }
                >
                  AND（全部匹配）
                </Button>
                <Button
                  size="sm"
                  variant={filters.logicMode === "OR" ? "default" : "outline"}
                  onClick={() => onChange({ ...filters, logicMode: "OR" })}
                  className={
                    filters.logicMode === "OR"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "border-amber-300 hover:bg-amber-50"
                  }
                >
                  OR（任意匹配）
                </Button>
              </div>
            </div>

            <Separator className="bg-amber-200" />

            {/* 标签筛选 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">按标签筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        filters.tags.includes(tag)
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "hover:bg-amber-100 border-amber-300"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-amber-500">暂无标签</span>
                )}
              </div>
            </div>

            <Separator className="bg-amber-200" />

            {/* 文档类型筛选 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileType className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">按类型筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableDocTypes.length > 0 ? (
                  availableDocTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={filters.docTypes.includes(type) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        filters.docTypes.includes(type)
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "hover:bg-blue-100 border-blue-300"
                      }`}
                      onClick={() => toggleDocType(type)}
                    >
                      {type}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-amber-500">暂无类型</span>
                )}
              </div>
            </div>

            <Separator className="bg-amber-200" />

            {/* 日期范围筛选 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">按日期筛选</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-amber-600 mb-1 block">开始日期</label>
                  <input
                    type="date"
                    value={filters.dateRange?.start.toISOString().split("T")[0] || ""}
                    onChange={(e) => {
                      const start = e.target.value ? new Date(e.target.value) : undefined;
                      onChange({
                        ...filters,
                        dateRange: start
                          ? {
                              start,
                              end: filters.dateRange?.end || new Date(),
                            }
                          : undefined,
                      });
                    }}
                    className="w-full px-2 py-1 text-sm border border-amber-200 rounded focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-600 mb-1 block">结束日期</label>
                  <input
                    type="date"
                    value={filters.dateRange?.end.toISOString().split("T")[0] || ""}
                    onChange={(e) => {
                      const end = e.target.value ? new Date(e.target.value) : undefined;
                      onChange({
                        ...filters,
                        dateRange: end
                          ? {
                              start: filters.dateRange?.start || new Date(),
                              end,
                            }
                          : undefined,
                      });
                    }}
                    className="w-full px-2 py-1 text-sm border border-amber-200 rounded focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
              {filters.dateRange && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onChange({ ...filters, dateRange: undefined })}
                  className="mt-2 h-7 text-xs text-amber-600 hover:text-amber-800"
                >
                  <X className="w-3 h-3 mr-1" />
                  清除日期范围
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
