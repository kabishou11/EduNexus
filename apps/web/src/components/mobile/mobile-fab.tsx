"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileFABProps {
  icon?: React.ReactNode;
  onClick: () => void;
  label?: string;
  position?: "bottom-right" | "bottom-center" | "bottom-left";
  className?: string;
}

/**
 * 移动端浮动操作按钮 (FAB)
 * 用于主要操作的快捷入口
 */
export function MobileFAB({
  icon = <Plus className="h-6 w-6" />,
  onClick,
  label,
  position = "bottom-right",
  className,
}: MobileFABProps) {
  const positionClasses = {
    "bottom-right": "bottom-20 right-4",
    "bottom-center": "bottom-20 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-20 left-4",
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "fixed z-40 md:hidden",
        positionClasses[position],
        className
      )}
    >
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "h-14 rounded-full shadow-2xl bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white",
          label ? "px-6 gap-2" : "w-14"
        )}
      >
        {icon}
        {label && <span className="font-medium">{label}</span>}
      </Button>
    </motion.div>
  );
}
