import { cn } from '@/utils/utils'
import { SidebarProvider } from '../context/sidebarContext'
import type { SidebarRootProps } from '../types/sidebar.types'

// 根容器组件
export const SidebarRoot = ({ 
  children, 
  defaultActiveId,
  classNames 
}: SidebarRootProps) => {
  return (
    <SidebarProvider defaultActiveId={defaultActiveId}>
      <nav 
        className={cn(
          'flex flex-col items-center',
          classNames?.root
        )}
      >
        {children}
      </nav>
    </SidebarProvider>
  )
}