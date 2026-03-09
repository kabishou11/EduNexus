"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ModelConfigPanelProps {
  temperature: number;
  topP: number;
  maxTokens: number;
  apiKey: string;
  onTemperatureChange: (value: number) => void;
  onTopPChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onApiKeyChange: (value: string) => void;
}

export function ModelConfigPanel({
  temperature,
  topP,
  maxTokens,
  apiKey,
  onTemperatureChange,
  onTopPChange,
  onMaxTokensChange,
  onApiKeyChange,
}: ModelConfigPanelProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">模型配置</h2>
        <p className="text-sm text-muted-foreground mt-1">
          配置 AI 模型参数和 API 密钥
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API 密钥</CardTitle>
          <CardDescription>管理您的 API 访问凭证</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>模型参数</CardTitle>
          <CardDescription>调整模型生成行为</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground">{temperature.toFixed(2)}</span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.01}
              value={[temperature]}
              onValueChange={(value) => onTemperatureChange(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              控制输出的随机性。较高的值使输出更随机，较低的值使其更确定。
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="topP">Top P</Label>
              <span className="text-sm text-muted-foreground">{topP.toFixed(2)}</span>
            </div>
            <Slider
              id="topP"
              min={0}
              max={1}
              step={0.01}
              value={[topP]}
              onValueChange={(value) => onTopPChange(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              核采样参数。控制模型考虑的 token 范围。
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <span className="text-sm text-muted-foreground">{maxTokens}</span>
            </div>
            <Slider
              id="maxTokens"
              min={100}
              max={4000}
              step={100}
              value={[maxTokens]}
              onValueChange={(value) => onMaxTokensChange(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              生成响应的最大 token 数量。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
