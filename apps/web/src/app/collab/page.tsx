"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Code, Users, Clock, Search } from "lucide-react";
import type { CollabSession } from "@/lib/collab/collab-types";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CollabPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<CollabSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    documentType: "markdown" as "markdown" | "code" | "text",
    language: "javascript",
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await fetch("/api/collab/session?userId=demo_user");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("加载会话失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!newSession.title.trim()) return;

    try {
      const res = await fetch("/api/collab/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSession,
          userId: "demo_user",
          userName: "演示用户",
        }),
      });

      if (res.ok) {
        const session = await res.json();
        router.push(`/collab/${session.id}`);
      }
    } catch (error) {
      console.error("创建会话失败:", error);
    }
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="w-5 h-5" />;
      case "markdown":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">协作编辑</h1>
          <p className="text-muted-foreground">
            实时协作编辑文档和代码
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建会话
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建协作会话</DialogTitle>
              <DialogDescription>
                创建一个新的协作编辑会话
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>标题</Label>
                <Input
                  value={newSession.title}
                  onChange={(e) =>
                    setNewSession({ ...newSession, title: e.target.value })
                  }
                  placeholder="输入会话标题"
                />
              </div>
              <div className="space-y-2">
                <Label>描述</Label>
                <Input
                  value={newSession.description}
                  onChange={(e) =>
                    setNewSession({ ...newSession, description: e.target.value })
                  }
                  placeholder="输入会话描述（可选）"
                />
              </div>
              <div className="space-y-2">
                <Label>文档类型</Label>
                <Select
                  value={newSession.documentType}
                  onValueChange={(value: any) =>
                    setNewSession({ ...newSession, documentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="code">代码</SelectItem>
                    <SelectItem value="text">纯文本</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newSession.documentType === "code" && (
                <div className="space-y-2">
                  <Label>编程语言</Label>
                  <Select
                    value={newSession.language}
                    onValueChange={(value) =>
                      setNewSession({ ...newSession, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={handleCreateSession} className="w-full">
                创建
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索会话..."
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "未找到匹配的会话" : "还没有协作会话"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              创建第一个会话
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/collab/${session.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(session.documentType)}
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                  </div>
                  {session.isPublic && (
                    <Badge variant="secondary">公开</Badge>
                  )}
                </div>
                {session.description && (
                  <CardDescription>{session.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{session.users.length} 位用户</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                  </div>
                  {session.tags && session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {session.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
