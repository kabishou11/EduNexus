"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Loader2,
  Brain,
  Lightbulb,
  BookOpen,
  Target,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  Paperclip,
  X,
  Download,
  Save,
  Code,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CodeExecutor } from "@/components/workspace/code-executor";
import { LearningNotes } from "@/components/workspace/learning-notes";
import { QuizGenerator } from "@/components/workspace/quiz-generator";
import { CompactLevelDisplay } from "@/components/compact-level-display";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[]; // Base64 encoded images
  attachments?: { name: string; type: string; url: string }[];
  thinking?: string;
  timestamp: Date;
};

export default function WorkspacePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是你的智能学习伙伴。我可以帮你：\n\n- 🔍 搜索知识宝库和星图\n- 📝 生成个性化练习题\n- 🗺️ 规划成长地图\n- 💡 解释复杂概念\n- 🤔 通过提问引导思考\n- 🖼️ 分析图片和图表（支持多模态）\n- 💻 解释和调试代码\n\n有什么想学习或探讨的吗？",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socraticMode, setSocraticMode] = useState(true);
  const [showThinking, setShowThinking] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"status" | "tools" | "notes" | "quiz">("status");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === files.length) {
            setUploadedImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const exportConversation = () => {
    const content = messages
      .map((m) => `[${m.role}] ${m.content}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `学习对话_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && uploadedImages.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue || "请分析这些图片",
      images: uploadedImages.length > 0 ? [...uploadedImages] : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setUploadedImages([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/workspace/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue || "请分析这些图片",
          images: uploadedImages.length > 0 ? uploadedImages : undefined,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
            images: m.images,
          })),
          config: {
            socraticMode,
            temperature: 0.7,
            maxIterations: 5,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          thinking: data.thinking,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，处理你的请求时出现了错误。请稍后重试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Brain, label: "解释概念", prompt: "请解释一下" },
    { icon: Lightbulb, label: "生成练习", prompt: "我想练习" },
    { icon: BookOpen, label: "学习路径", prompt: "我想学习" },
    { icon: Target, label: "检查理解", prompt: "测试我对...的理解" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-rose-50/30">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-white/80 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">学习工作区</h1>
                <p className="text-sm text-muted-foreground">
                  智能学习伙伴 · 随时为你答疑解惑
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="socratic"
                  checked={socraticMode}
                  onCheckedChange={setSocraticMode}
                />
                <Label htmlFor="socratic" className="text-sm cursor-pointer">
                  苏格拉底模式
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="thinking"
                  checked={showThinking}
                  onCheckedChange={setShowThinking}
                />
                <Label htmlFor="thinking" className="text-sm cursor-pointer">
                  显示思考
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "rounded-2xl p-4 max-w-[80%] shadow-sm transition-all hover:shadow-md",
                    message.role === "user"
                      ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                      : "bg-white border border-gray-200"
                  )}
                >
                  {message.thinking && showThinking && (
                    <details className="mb-3 text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
                        <Brain className="h-4 w-4" />
                        思考过程
                      </summary>
                      <div className="mt-2 p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg text-xs whitespace-pre-wrap border border-orange-100">
                        {message.thinking}
                      </div>
                    </details>
                  )}
                  {message.images && message.images.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {message.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`上传的图片 ${idx + 1}`}
                          className="rounded-lg border border-gray-200 max-h-48 object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer content={message.content} />
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="p-2 rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 h-8 w-8 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">正在思考...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(action.prompt)}
                    className="flex-shrink-0 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={exportConversation}
                className="flex-shrink-0 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                导出对话
              </Button>
            </div>

            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="mb-3 flex gap-2 flex-wrap">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`预览 ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded-lg border-2 border-orange-300"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex-shrink-0"
                title="上传图片"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  socraticMode
                    ? "提出你的问题，我会引导你思考..."
                    : "输入你的问题..."
                }
                className="min-h-[60px] max-h-[200px] resize-none rounded-xl border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={(!inputValue.trim() && uploadedImages.length === 0) || isLoading}
                className="bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {socraticMode ? (
                <span>💡 苏格拉底模式：我会通过提问引导你思考</span>
              ) : (
                <span>📚 直接教学模式：我会直接解答你的问题</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info Panel */}
      <div className="w-80 border-l bg-white/50 backdrop-blur-sm overflow-y-auto flex flex-col">
        {/* Tabs */}
        <div className="border-b bg-white/80 p-2 flex gap-1">
          <Button
            variant={activeTab === "status" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("status")}
            className="flex-1 text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            状态
          </Button>
          <Button
            variant={activeTab === "tools" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("tools")}
            className="flex-1 text-xs"
          >
            <Code className="h-3 w-3 mr-1" />
            工具
          </Button>
          <Button
            variant={activeTab === "notes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("notes")}
            className="flex-1 text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            笔记
          </Button>
          <Button
            variant={activeTab === "quiz" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("quiz")}
            className="flex-1 text-xs"
          >
            <Target className="h-3 w-3 mr-1" />
            练习
          </Button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "status" && (
            <>
              <CompactLevelDisplay className="mb-4" />

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    助手状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">工作模式</span>
                    <Badge variant={socraticMode ? "default" : "secondary"}>
                      {socraticMode ? "苏格拉底" : "直接教学"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">对话轮数</span>
                    <Badge variant="outline">{messages.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">状态</span>
                    <Badge variant={isLoading ? "default" : "secondary"}>
                      {isLoading ? "思考中" : "就绪"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm">可用工具</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-blue-100">
                      <BookOpen className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">搜索知识宝库</div>
                      <div className="text-muted-foreground">查找相关文档</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-purple-100">
                      <Brain className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">查询知识星图</div>
                      <div className="text-muted-foreground">获取知识关系</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-green-100">
                      <Target className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">生成练习</div>
                      <div className="text-muted-foreground">个性化题目</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-orange-100">
                      <Lightbulb className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">成长地图</div>
                      <div className="text-muted-foreground">智能规划</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-pink-100">
                      <ImageIcon className="h-3 w-3 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-medium">图片分析</div>
                      <div className="text-muted-foreground">多模态理解</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm">使用提示</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• 苏格拉底模式会引导你思考</p>
                  <p>• 可以查看助手的思考过程</p>
                  <p>• 支持上传图片进行分析</p>
                  <p>• 使用快捷按钮快速开始</p>
                  <p>• Shift+Enter 换行，Enter 发送</p>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "tools" && (
            <div className="space-y-4">
              <CodeExecutor />
            </div>
          )}

          {activeTab === "notes" && <LearningNotes />}

          {activeTab === "quiz" && <QuizGenerator />}
        </div>
      </div>
    </div>
  );
}
