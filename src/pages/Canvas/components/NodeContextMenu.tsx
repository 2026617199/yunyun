import { IconCopy, IconTrash } from '@tabler/icons-react'
import type { PropsWithChildren } from 'react'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'

type NodeContextMenuProps = PropsWithChildren<{
    onDuplicate: () => void
    onDelete: () => void
}>

/**
 * 节点右键菜单组件
 * 提供复制和删除功能
 */
export const NodeContextMenu = ({ children, onDuplicate, onDelete }: NodeContextMenuProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-44 bg-neutral-800/95 border-neutral-600">
                <ContextMenuItem
                    className="text-neutral-200 focus:bg-neutral-700 focus:text-neutral-100 cursor-pointer"
                    onSelect={onDuplicate}
                >
                    <IconCopy size={15} />
                    复制节点
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-neutral-600" />
                <ContextMenuItem
                    className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
                    onSelect={onDelete}
                >
                    <IconTrash size={15} />
                    删除节点
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
