import { SidebarContextValue } from '@/types/sidebar/sidebar'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'

// 创建上下文
const SidebarContext = createContext<SidebarContextValue | null>(null)

// Provider 属性类型
type SidebarProviderProps = {
  children: React.ReactNode
  defaultActiveId?: string
}

// Sidebar Provider 组件
export const SidebarProvider = ({
  children,
  defaultActiveId
}: SidebarProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId || null)
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const value = useMemo<SidebarContextValue>(() => ({
    activeId,
    setActiveId,
    collapsed,
    toggleCollapsed
  }), [activeId, collapsed, toggleCollapsed])

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

// 自定义 hook 获取上下文值
export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export { SidebarContext }
