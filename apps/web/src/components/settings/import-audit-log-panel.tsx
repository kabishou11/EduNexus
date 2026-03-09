"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  status: "success" | "error" | "warning" | "info";
  details: string;
}

const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2026-03-09 14:32:15",
    action: "数据导入",
    user: "admin@edunexus.com",
    status: "success",
    details: "成功导入 150 条记录",
  },
  {
    id: "2",
    timestamp: "2026-03-09 13:15:42",
    action: "模型配置更新",
    user: "admin@edunexus.com",
    status: "success",
    details: "Temperature 更新为 0.7",
  },
  {
    id: "3",
    timestamp: "2026-03-09 11:20:33",
    action: "API 密钥更新",
    user: "admin@edunexus.com",
    status: "warning",
    details: "API 密钥已更新，旧密钥将在 24 小时后失效",
  },
  {
    id: "4",
    timestamp: "2026-03-09 09:45:12",
    action: "数据导出",
    user: "admin@edunexus.com",
    status: "success",
    details: "导出 500 条记录到 JSON",
  },
  {
    id: "5",
    timestamp: "2026-03-08 16:30:00",
    action: "主题切换",
    user: "admin@edunexus.com",
    status: "info",
    details: "主题从亮色切换到暗色",
  },
];

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
};

export function ImportAuditLogPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>审计日志</CardTitle>
        <CardDescription>查看系统操作历史记录</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] overflow-y-auto pr-4">
          <div className="space-y-3">
            {mockLogs.map((log) => {
              const StatusIcon = statusConfig[log.status].icon;
              return (
                <div
                  key={log.id}
                  className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`mt-0.5 ${statusConfig[log.status].bg} p-1.5 rounded-full`}>
                    <StatusIcon className={`h-4 w-4 ${statusConfig[log.status].color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{log.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
