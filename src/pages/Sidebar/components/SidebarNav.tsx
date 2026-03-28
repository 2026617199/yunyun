import { SidebarNavProps } from '@/types/sidebar/sidebar'
import { cn } from '@/utils/utils'

// 导航区域组件
export const SidebarNav = ({
  children,
  classNames
}: SidebarNavProps) => {
  return (
    <div className={cn('flex flex-col items-center w-full', classNames?.root)}>
      {children}
    </div>
  )
}
