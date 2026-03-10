'use client'

import { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { MobileNav } from '@/components/mobile/mobile-nav'
import { MobileMenu } from '@/components/mobile/mobile-menu'
import { useIsMobile } from '@/lib/hooks/use-media-query'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      <div className="flex h-screen">
        {/* 桌面端侧边栏 */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* 主内容区 */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* 移动端导航 */}
      {isMobile && (
        <>
          <MobileNav />
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}
    </>
  )
}
