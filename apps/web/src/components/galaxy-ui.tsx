import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp } from "lucide-react";

type HeroMetric = {
  label: string;
  value: string;
  hint?: string;
};

type GalaxyHeroProps = {
  badge: string;
  title: string;
  description: string;
  quote: string;
  chips?: string[];
  metrics?: HeroMetric[];
  actions?: ReactNode;
};

export function GalaxyHero({
  badge,
  title,
  description,
  quote,
  chips = [],
  metrics = [],
  actions
}: GalaxyHeroProps) {
  return (
    <Card className="galaxy-hero col-span-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="relative z-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-4">
            <Badge className="badge-primary w-fit">
              <Sparkles className="w-3 h-3 mr-1" />
              {badge}
            </Badge>

            <CardTitle className="text-3xl md:text-4xl font-bold leading-tight text-balance max-w-3xl">
              {title}
            </CardTitle>

            <CardDescription className="text-base md:text-lg leading-relaxed max-w-2xl text-balance">
              {description}
            </CardDescription>

            {chips.length > 0 && (
              <div className="chip-row pt-2">
                {chips.map((chip) => (
                  <span className="feature-chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {actions && (
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
                {actions}
              </div>
            )}
          </div>

          {metrics.length > 0 && (
            <div className="hidden lg:flex flex-col gap-3 min-w-[280px]">
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">核心指标</span>
                </div>
                <Separator />
                <div className="space-y-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs text-muted-foreground">{metric.label}</span>
                        <span className="text-2xl font-bold text-primary">{metric.value}</span>
                      </div>
                      {metric.hint && (
                        <p className="text-xs text-muted-foreground">{metric.hint}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className="glass-card p-4 border-l-4 border-l-primary/50">
          <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {metrics.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden">
            {metrics.map((metric) => (
              <div key={metric.label} className="glass-card p-3 text-center space-y-1">
                <div className="text-2xl font-bold text-primary">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                {metric.hint && (
                  <div className="text-[11px] text-muted-foreground/80">{metric.hint}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type SpotlightProps = {
  title: string;
  description: string;
  status?: string;
  icon?: ReactNode;
};

export function GalaxySpotlight({ title, description, status, icon }: SpotlightProps) {
  return (
    <Card className="h-full border-border/60 bg-card/70 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {icon && <div className="text-primary">{icon}</div>}
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <CardDescription className="leading-relaxed">
              {description}
            </CardDescription>
          </div>
          {status && (
            <Badge variant="secondary" className="flex-shrink-0">
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
