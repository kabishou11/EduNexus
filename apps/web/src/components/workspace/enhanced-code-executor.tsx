"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Loader2, Terminal, AlertCircle, CheckCircle } from "lucide-react";
import { MonacoEditor } from "./monaco-editor";
import { executePython, loadPyodide } from "@/lib/workspace/python-executor";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnhancedCodeExecutorProps {
  initialCode?: string;
  initialLanguage?: string;
  onExecute?: (code: string, result: string) => void;
}

export function EnhancedCodeExecutor({
  initialCode = "",
  initialLanguage = "javascript",
  onExecute,
}: EnhancedCodeExecutorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingPyodide, setLoadingPyodide] = useState(false);

  useEffect(() => {
    if (language === "python" && !pyodideReady && !loadingPyodide) {
      setLoadingPyodide(true);
      loadPyodide()
        .then(() => {
          setPyodideReady(true);
          setLoadingPyodide(false);
        })
        .catch((err) => {
          console.error("Failed to load Pyodide:", err);
          setLoadingPyodide(false);
        });
    }
  }, [language, pyodideReady, loadingPyodide]);

  const executeJavaScript = async (code: string) => {
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      logs.push(args.map((arg) => String(arg)).join(" "));
      originalLog(...args);
    };
    console.error = (...args) => {
      logs.push("ERROR: " + args.map((arg) => String(arg)).join(" "));
      originalError(...args);
    };
    console.warn = (...args) => {
      logs.push("WARN: " + args.map((arg) => String(arg)).join(" "));
      originalWarn(...args);
    };

    try {
      const result = eval(code);
      if (result !== undefined) {
        logs.push(`返回值: ${String(result)}`);
      }
      return { output: logs.join("\n") || "执行成功（无输出）", error: undefined };
    } catch (error) {
      return {
        output: logs.join("\n"),
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput("");
    setError(null);

    try {
      let result: { output: string; error?: string };

      if (language === "javascript" || language === "typescript") {
        result = await executeJavaScript(code);
      } else if (language === "python") {
        if (!pyodideReady) {
          setError("Python 环境正在加载中，请稍候...");
          setIsRunning(false);
          return;
        }
        result = await executePython(code);
      } else {
        result = {
          output: "",
          error: `不支持的语言: ${language}`,
        };
      }

      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      }
      onExecute?.(code, result.output);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const canExecute = language === "javascript" || language === "typescript" || language === "python";

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            代码执行器
          </div>
          {language === "python" && (
            <div className="text-xs font-normal">
              {loadingPyodide ? (
                <span className="text-orange-500 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  加载 Python...
                </span>
              ) : pyodideReady ? (
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Python 就绪
                </span>
              ) : null}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex-1 min-h-[300px]">
          <MonacoEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>

        <Button
          onClick={executeCode}
          disabled={!code.trim() || isRunning || !canExecute || (language === "python" && !pyodideReady)}
          className="w-full"
          size="sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              执行中...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              运行代码
            </>
          )}
        </Button>

        {!canExecute && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              当前仅支持 JavaScript、TypeScript 和 Python 代码执行
            </AlertDescription>
          </Alert>
        )}

        {(output || error) && (
          <div className="space-y-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-mono whitespace-pre-wrap">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            {output && (
              <div className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {output}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
