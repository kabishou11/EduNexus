import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  tags?: string[];
  actions?: ReactNode;
  metaLabel?: string;
  statusLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  tags = [],
  actions,
  metaLabel = "EduNexus · Web 学习生态",
  statusLabel = "系统在线",
  className
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-6 mb-12 animate-in", className)}>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="status-dot online" />
          <span className="text-muted-foreground font-medium">{metaLabel}</span>
        </div>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <Badge variant="secondary" className="badge-success">
          {statusLabel}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex-1 space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text text-balance">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed text-balance">
              {description}
            </p>
          </div>

          {actions && (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap lg:max-w-xl lg:justify-end lg:flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "feature-chip",
                  index === 0 && "badge-primary"
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator className="divider" />
    </header>
  );
}
