"use client";

import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useSafeArea } from "@/lib/hooks/use-safe-area";

interface MobileHeaderProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

/**
 * 移动端顶部栏
 * 包含标题、菜单按钮和操作按钮
 */
export function MobileHeader({
  title = "EduNexus",
  showMenu = true,
  onMenuClick,
  actions,
}: MobileHeaderProps) {
  const safeArea = useSafeArea();

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-border md:hidden"
      style={{
        paddingTop: `${safeArea.top}px`,
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              EN
            </div>
            <span className="text-base font-semibold">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
