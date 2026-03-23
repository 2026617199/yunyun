import { IconPhoto, IconNote, IconVideo } from '@tabler/icons-react'
import type { PropsWithChildren } from 'react'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'

export type CanvasNodeType = 'note' | 'image' | 'video'

type CanvasContextMenuProps = PropsWithChildren<{
    onCreateNode: (nodeType: CanvasNodeType) => void
    onOpenChange?: (open: boolean) => void
}>

export const CanvasContextMenu = ({ children, onCreateNode, onOpenChange }: CanvasContextMenuProps) => {
    return (
        <ContextMenu onOpenChange={onOpenChange}>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuLabel>创建节点</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem onSelect={() => onCreateNode('note')}>
                    <IconNote size={16} />
                    新建便签节点
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onCreateNode('image')}>
                    <IconPhoto size={16} />
                    新建图片节点
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onCreateNode('video')}>
                    <IconVideo size={16} />
                    新建视频节点
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
