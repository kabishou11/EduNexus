"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Target, CheckCircle, XCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setShowResults(false);
    setUserAnswers({});

    try {
      const response = await fetch("/api/workspace/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `请为"${topic}"生成3道选择题，以JSON格式返回，格式为：[{"question": "问题", "options": ["选项A", "选项B", "选项C", "选项D"], "correctAnswer": 0, "explanation": "解释"}]`,
          history: [],
          config: { temperature: 0.8 },
        }),
      });

      const data = await response.json();

      // 尝试从响应中提取 JSON
      const jsonMatch = data.response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setQuestions(parsed);
      } else {
        // 如果无法解析，创建示例题目
        setQuestions([
          {
            question: `关于${topic}的问题1`,
            options: ["选项A", "选项B", "选项C", "选项D"],
            correctAnswer: 0,
            explanation: "这是解释"
          }
        ]);
      }
    } catch (error) {
      console.error("生成练习题失败:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const score = showResults
    ? questions.reduce((acc, q, idx) => {
        return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0)
    : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          练习题生成器
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="输入主题（如：JavaScript闭包）"
            className="text-sm"
          />
          <Button onClick={generateQuiz} disabled={!topic.trim() || isGenerating} size="sm">
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "生成"
            )}
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-sm mb-2">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-1">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => selectAnswer(qIdx, oIdx)}
                      disabled={showResults}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        userAnswers[qIdx] === oIdx
                          ? showResults
                            ? oIdx === q.correctAnswer
                              ? "bg-green-200 border-green-400"
                              : "bg-red-200 border-red-400"
                            : "bg-blue-200 border-blue-400"
                          : showResults && oIdx === q.correctAnswer
                          ? "bg-green-100 border-green-300"
                          : "bg-white hover:bg-blue-100"
                      } border`}
                    >
                      <div className="flex items-center gap-2">
                        {showResults && oIdx === q.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {showResults && userAnswers[qIdx] === oIdx && oIdx !== q.correctAnswer && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {showResults && (
                  <p className="mt-2 text-xs text-gray-600 bg-white p-2 rounded">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            ))}

            {!showResults && Object.keys(userAnswers).length === questions.length && (
              <Button onClick={submitQuiz} className="w-full" size="sm">
                提交答案
              </Button>
            )}

            {showResults && (
              <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg text-center">
                <p className="font-semibold">
                  得分: {score} / {questions.length}
                </p>
                <p className="text-sm text-gray-600">
                  {score === questions.length
                    ? "🎉 完美！全部正确！"
                    : score >= questions.length / 2
                    ? "👍 不错！继续加油！"
                    : "💪 再接再厉！"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
