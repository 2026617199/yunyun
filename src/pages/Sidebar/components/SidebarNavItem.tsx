import { cn } from '@/utils/utils'
import { useSidebar } from '../context/sidebarContext'
import { SidebarNavItemProps } from '@/types/sidebar/sidebar'

// 导航项组件
export const SidebarNavItem = ({
  id,
  icon,
  label,
  onClick,
  classNames
}: SidebarNavItemProps) => {
  const { activeId, setActiveId } = useSidebar()
  const isActive = activeId === id

  const handleClick = () => {
    setActiveId(id)
    onClick?.()
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'w-11 h-11 flex justify-center items-center cursor-pointer rounded-xl mb-3 transition-all relative',
        isActive
          ? 'text-[#00F0FF] bg-[rgba(0,240,255,0.08)] shadow-[inset_0_0_0_1px_rgba(0,240,255,0.2)] before:absolute before:left-[-14px] before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-4 before:bg-[#00F0FF] before:shadow-[0_0_10px_#00F0FF]'
          : 'text-white/40 hover:text-white hover:bg-white/5',
        classNames?.root
      )}
      title={label}
      data-active={isActive}
    >
      {icon && (
        <span className={cn(classNames?.icon)}>
          {icon}
        </span>
      )}
    </div>
  )
}
