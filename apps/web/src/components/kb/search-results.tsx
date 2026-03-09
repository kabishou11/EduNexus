"use client";

import { useMemo } from "react";
import { FileText, Calendar, Tag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { KBDocument } from "@/lib/client/kb-storage";

type SearchResultsProps = {
  documents: KBDocument[];
  searchQuery: string;
  onSelectDocument: (doc: KBDocument) => void;
  selectedDocId?: string;
  sortBy?: "relevance" | "date" | "title";
};

// 高亮搜索关键词
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 text-amber-900 font-medium">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// 生成搜索结果摘要
function generateSnippet(content: string, query: string, maxLength: number = 150): string {
  if (!query.trim()) {
    return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "");
  }

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "");
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 100);
  const snippet = content.slice(start, end);

  return (start > 0 ? "..." : "") + snippet + (end < content.length ? "..." : "");
}

export function SearchResults({
  documents,
  searchQuery,
  onSelectDocument,
  selectedDocId,
  sortBy = "relevance",
}: SearchResultsProps) {
  // 排序文档
  const sortedDocuments = useMemo(() => {
    const docs = [...documents];

    switch (sortBy) {
      case "date":
        return docs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      case "title":
        return docs.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
      case "relevance":
      default:
        // 简单的相关性排序：标题匹配 > 内容匹配
        return docs.sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(searchQuery.toLowerCase());
          const bTitle = b.title.toLowerCase().includes(searchQuery.toLowerCase());
          if (aTitle && !bTitle) return -1;
          if (!aTitle && bTitle) return 1;
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        });
    }
  }, [documents, sortBy, searchQuery]);

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-amber-600">
        <FileText className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">未找到匹配的文档</p>
        <p className="text-sm text-amber-500 mt-2">尝试使用不同的关键词或调整筛选条件</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-amber-600">
          找到 <span className="font-semibold text-amber-900">{documents.length}</span> 个结果
        </span>
      </div>

      {sortedDocuments.map((doc) => {
        const snippet = generateSnippet(doc.content, searchQuery);
        const isSelected = doc.id === selectedDocId;

        return (
          <Card
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "border-amber-400 bg-amber-50/50 shadow-sm"
                : "border-amber-200 hover:border-amber-300"
            }`}
          >
            {/* 标题 */}
            <div className="flex items-start gap-3 mb-2">
              <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-amber-950 mb-1 line-clamp-1">
                  {highlightText(doc.title, searchQuery)}
                </h3>
              </div>
              {isSelected && (
                <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0" />
              )}
            </div>

            {/* 摘要 */}
            <p className="text-sm text-amber-700 mb-3 line-clamp-2 pl-8">
              {highlightText(snippet, searchQuery)}
            </p>

            {/* 元信息 */}
            <div className="flex items-center gap-4 text-xs text-amber-600 pl-8">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{doc.updatedAt.toLocaleDateString("zh-CN")}</span>
              </div>

              {doc.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tag className="w-3 h-3" />
                  {doc.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1.5 py-0"
                    >
                      {highlightText(tag, searchQuery)}
                    </Badge>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-amber-500">+{doc.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
