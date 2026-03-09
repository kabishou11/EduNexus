"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Loader2, Code } from "lucide-react";

interface CodeExecutorProps {
  onExecute?: (code: string, result: string) => void;
}

export function CodeExecutor({ onExecute }: CodeExecutorProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = async () => {
    setIsRunning(true);
    setOutput("执行中...");

    try {
      // 使用 eval 执行代码（仅用于演示，生产环境需要沙箱）
      const result = eval(code);
      const outputText = result !== undefined ? String(result) : "执行成功";
      setOutput(outputText);
      onExecute?.(code, outputText);
    } catch (error) {
      setOutput(`错误: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Code className="h-4 w-4" />
          代码执行器
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="输入 JavaScript 代码..."
          className="font-mono text-sm min-h-[120px]"
        />
        <Button
          onClick={executeCode}
          disabled={!code.trim() || isRunning}
          className="w-full"
          size="sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              执行中
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              运行代码
            </>
          )}
        </Button>
        {output && (
          <div className="p-3 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono whitespace-pre-wrap">
            {output}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
