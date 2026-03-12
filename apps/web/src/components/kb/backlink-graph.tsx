"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Link2 } from "lucide-react";
import type { KBDocument } from "@/lib/client/kb-storage";

type BacklinkGraphProps = {
  currentDocument: KBDocument | null;
  allDocuments: KBDocument[];
  onDocumentClick: (doc: KBDocument) => void;
};

export function BacklinkGraph({
  currentDocument,
  allDocuments,
  onDocumentClick,
}: BacklinkGraphProps) {
  // 提取文档中的双链
  const extractBacklinks = (content: string): string[] => {
    const regex = /\[\[([^\]]+)\]\]/g;
    const links: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      links.push(match[1]);
    }
    return links;
  };

  // 获取当前文档的出链（当前文档链接到的其他文档）
  const outgoingLinks = useMemo(() => {
    if (!currentDocument) return [];
    const links = extractBacklinks(currentDocument.content);
    return allDocuments.filter((doc) => links.includes(doc.title));
  }, [currentDocument, allDocuments]);

  // 获取当前文档的入链（其他文档链接到当前文档）
  const incomingLinks = useMemo(() => {
    if (!currentDocument) return [];
    return allDocuments.filter((doc) => {
      const links = extractBacklinks(doc.content);
      return links.includes(currentDocument.title);
    });
  }, [currentDocument, allDocuments]);

  // 获取相关文档（共享标签的文档）
  const relatedDocuments = useMemo(() => {
    if (!currentDocument) return [];
    return allDocuments
      .filter((doc) => {
        if (doc.id === currentDocument.id) return false;
        return doc.tags.some((tag) => currentDocument.tags.includes(tag));
      })
      .slice(0, 5);
  }, [currentDocument, allDocuments]);

  if (!currentDocument) {
    return (
      <Card className="border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            文档关系图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-500">选择一个文档查看关系</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          文档关系图
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 出链 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">
              链接到
            </span>
            <Badge variant="outline" className="text-xs">
              {outgoingLinks.length}
            </Badge>
          </div>
          {outgoingLinks.length > 0 ? (
            <div className="space-y-1">
              {outgoingLinks.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onDocumentClick(doc)}
                  className="w-full p-2 rounded-lg border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-900 truncate">
                      {doc.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-500">暂无出链</p>
          )}
        </div>

        {/* 入链 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">
              被链接
            </span>
            <Badge variant="outline" className="text-xs">
              {incomingLinks.length}
            </Badge>
          </div>
          {incomingLinks.length > 0 ? (
            <div className="space-y-1">
              {incomingLinks.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onDocumentClick(doc)}
                  className="w-full p-2 rounded-lg border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-900 truncate">
                      {doc.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-500">暂无入链</p>
          )}
        </div>

        {/* 相关文档 */}
        {relatedDocuments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-700">
                相关文档
              </span>
              <Badge variant="outline" className="text-xs">
                {relatedDocuments.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {relatedDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onDocumentClick(doc)}
                  className="w-full p-2 rounded-lg border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-900 truncate">
                      {doc.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doc.tags
                      .filter((tag) => currentDocument.tags.includes(tag))
                      .slice(0, 2)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="pt-3 border-t border-amber-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-amber-900">
                {outgoingLinks.length}
              </div>
              <div className="text-xs text-amber-600">出链</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-900">
                {incomingLinks.length}
              </div>
              <div className="text-xs text-amber-600">入链</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-900">
                {currentDocument.tags.length}
              </div>
              <div className="text-xs text-amber-600">标签</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BacklinkGraph;
