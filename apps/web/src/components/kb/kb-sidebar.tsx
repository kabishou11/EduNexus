"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Settings,
  FileText,
  Clock,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { KBDocument, KBVault } from "@/lib/client/kb-storage";

interface KBSidebarProps {
  vaults: KBVault[];
  currentVault: KBVault | null;
  documents: KBDocument[];
  currentDoc: KBDocument | null;
  onVaultChange: (vaultId: string) => void;
  onCreateDocument: (title: string) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
  onSelectDocument: (doc: KBDocument) => void;
}

export function KBSidebar({
  vaults,
  currentVault,
  documents,
  currentDoc,
  onCreateDocument,
  onDeleteDocument,
  onSelectDocument,
}: KBSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewDocDialog, setShowNewDocDialog] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    recent: true,
    all: true,
  });

  const filteredDocs = documents.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const recentDocs = [...documents]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) return;
    await onCreateDocument(newDocTitle);
    setNewDocTitle("");
    setShowNewDocDialog(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <Button variant="ghost" className="w-full justify-start font-semibold" disabled>
          <FileText className="h-4 w-4 mr-2" />
          {currentVault?.name || vaults[0]?.name || "默认知识库"}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="mb-2">
          <button
            onClick={() => toggleSection("recent")}
            className="flex items-center w-full px-2 py-1.5 text-sm font-medium hover:bg-accent rounded-md transition-colors"
          >
            {expandedSections.recent ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <Clock className="h-4 w-4 mr-2" />
            最近访问
          </button>
          {expandedSections.recent && (
            <div className="ml-4 mt-1 space-y-0.5">
              {recentDocs.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={doc}
                  isActive={currentDoc?.id === doc.id}
                  onSelect={onSelectDocument}
                  onDelete={onDeleteDocument}
                />
              ))}
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <div className="mb-2">
          <button
            onClick={() => toggleSection("all")}
            className="flex items-center w-full px-2 py-1.5 text-sm font-medium hover:bg-accent rounded-md transition-colors"
          >
            {expandedSections.all ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <FileText className="h-4 w-4 mr-2" />
            所有文档
            <span className="ml-auto text-xs text-muted-foreground">
              {filteredDocs.length}
            </span>
          </button>
          {expandedSections.all && (
            <div className="ml-4 mt-1 space-y-0.5">
              {filteredDocs.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={doc}
                  isActive={currentDoc?.id === doc.id}
                  onSelect={onSelectDocument}
                  onDelete={onDeleteDocument}
                />
              ))}
              {filteredDocs.length === 0 && (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  {searchQuery ? "未找到匹配的文档" : "暂无文档"}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 pt-2 border-t space-y-2">
        <Button
          onClick={() => setShowNewDocDialog(true)}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          新建文档
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" disabled>
          <Settings className="h-4 w-4 mr-2" />
          设置
        </Button>
      </div>

      <Dialog open={showNewDocDialog} onOpenChange={setShowNewDocDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建文档</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="输入文档标题..."
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleCreateDocument();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDocDialog(false)}>
              取消
            </Button>
            <Button onClick={() => void handleCreateDocument()} disabled={!newDocTitle.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentItem({
  doc,
  isActive,
  onSelect,
  onDelete,
}: {
  doc: KBDocument;
  isActive: boolean;
  onSelect: (doc: KBDocument) => void;
  onDelete: (docId: string) => Promise<void>;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
        isActive ? "bg-accent" : "hover:bg-accent/50"
      )}
      onClick={() => onSelect(doc)}
    >
      <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm truncate">{doc.title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              void onDelete(doc.id);
            }}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
