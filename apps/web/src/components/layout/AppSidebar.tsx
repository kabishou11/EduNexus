'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/lib/stores/sidebar-store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Home,
  Network,
  BookOpen,
  Route,
  Briefcase,
  GraduationCap,
  Settings,
  ChevronLeft,
  Menu,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const navigation = [
  {
    title: '核心功能',
    items: [
      { name: '总览', href: '/', icon: Home },
      { name: '知识图谱', href: '/graph', icon: Network },
      { name: '知识库', href: '/kb', icon: BookOpen },
      { name: '学习路径', href: '/path', icon: Route },
    ],
  },
  {
    title: '工作区',
    items: [
      { name: '学习工作区', href: '/workspace', icon: Briefcase },
      { name: '教师工作台', href: '/teacher', icon: GraduationCap },
    ],
  },
  {
    title: '系统',
    items: [
      { name: '配置中心', href: '/settings', icon: Settings },
    ],
  },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapse } = useSidebarStore()

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'app-sidebar flex h-full flex-col bg-sidebar border-sidebar-border border-r transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center group',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          {isCollapsed ? (
            <div className="relative flex items-center justify-center w-full">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm transition-opacity group-hover:opacity-0">
                EN
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="absolute text-sidebar-foreground hover:bg-sidebar-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  EN
                </div>
                <span className="text-base font-medium text-sidebar-foreground">
                  EduNexus
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <nav
          className={cn(
            'flex-1 space-y-1 py-4',
            isCollapsed ? 'px-2' : 'px-3'
          )}
        >
          {navigation.map((section, index) => (
            <div key={section.title}>
              {index > 0 && (
                <Separator className="my-3" />
              )}
              <div className="space-y-1">
                {!isCollapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    {section.title}
                  </h3>
                )}

                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                  const button = (
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full gap-3 text-sidebar-foreground sidebar-menu-item',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                        isCollapsed ? 'justify-center px-2' : 'justify-start'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Button>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <Link href={item.href}>
                            {button}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.name}</TooltipContent>
                      </Tooltip>
                    )
                  }

                  return (
                    <Link key={item.name} href={item.href}>
                      {button}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div
          className={cn(
            'border-t border-sidebar-border p-3',
            isCollapsed && 'px-2'
          )}
        >
          <div className={cn(
            'flex items-center',
            isCollapsed ? 'justify-center' : 'justify-end'
          )}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
