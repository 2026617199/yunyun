import { SidebarLogoProps } from '@/types/sidebar/sidebar'
import { cn } from '@/utils/utils'

// Logo 区域组件
export const SidebarLogo = ({
  children,
  classNames
}: SidebarLogoProps) => {
  return (
    <div className={cn('mb-10', classNames?.root)}>
      {children}
    </div>
  )
}
