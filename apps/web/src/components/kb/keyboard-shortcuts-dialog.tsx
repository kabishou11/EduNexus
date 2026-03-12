"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    {
      category: "文本格式",
      items: [
        { keys: ["Cmd/Ctrl", "B"], description: "粗体" },
        { keys: ["Cmd/Ctrl", "I"], description: "斜体" },
        { keys: ["Cmd/Ctrl", "Shift", "X"], description: "删除线" },
        { keys: ["Cmd/Ctrl", "E"], description: "行内代码" },
        { keys: ["Cmd/Ctrl", "Shift", "C"], description: "代码块" },
      ],
    },
    {
      category: "标题",
      items: [
        { keys: ["Cmd/Ctrl", "Alt", "1"], description: "标题 1" },
        { keys: ["Cmd/Ctrl", "Alt", "2"], description: "标题 2" },
        { keys: ["Cmd/Ctrl", "Alt", "3"], description: "标题 3" },
      ],
    },
    {
      category: "列表",
      items: [
        { keys: ["Cmd/Ctrl", "Shift", "8"], description: "无序列表" },
        { keys: ["Cmd/Ctrl", "Shift", "7"], description: "有序列表" },
        { keys: ["Cmd/Ctrl", "Shift", "9"], description: "任务列表" },
      ],
    },
    {
      category: "其他",
      items: [
        { keys: ["Cmd/Ctrl", "Shift", "Q"], description: "引用" },
        { keys: ["Cmd/Ctrl", "Shift", "-"], description: "水平线" },
        { keys: ["Cmd/Ctrl", "Z"], description: "撤销" },
        { keys: ["Cmd/Ctrl", "Shift", "Z"], description: "重做" },
      ],
    },
    {
      category: "Markdown 快捷输入",
      items: [
        { keys: ["##", "空格"], description: "标题 2" },
        { keys: ["###", "空格"], description: "标题 3" },
        { keys: ["-", "空格"], description: "无序列表" },
        { keys: ["1.", "空格"], description: "有序列表" },
        { keys: ["[ ]", "空格"], description: "任务列表" },
        { keys: [">", "空格"], description: "引用" },
        { keys: ["```"], description: "代码块" },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="快捷键">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>键盘快捷键</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {shortcuts.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold mb-3 text-sm">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIdx) => (
                        <span key={keyIdx} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                            {key}
                          </kbd>
                          {keyIdx < item.keys.length - 1 && (
                            <span className="text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {idx < shortcuts.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

