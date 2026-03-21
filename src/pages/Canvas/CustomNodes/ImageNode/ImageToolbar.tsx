import { IconCopy, IconTrash, IconRefresh } from '@tabler/icons-react'

type ImageToolbarProps = {
    onDuplicate: () => void
    onDelete: () => void
    onRetry?: () => void
}

/**
 * 图片节点工具栏组件
 * 职责：
 * - 提供复制、删除、重新生成等操作按钮
 * - 仅在节点选中时显示
 */
export const ImageToolbar = ({
    onDuplicate,
    onDelete,
    onRetry,
}: ImageToolbarProps) => {
    return (
        <div className="noflow nopan nodrag absolute -top-12 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background px-2 py-1 shadow-sm">
            {onRetry && (
                <button
                    type="button"
                    title="重新生成"
                    aria-label="重新生成"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={onRetry}
                >
                    <IconRefresh size={16} />
                </button>
            )}

            <button
                type="button"
                title="复制节点"
                aria-label="复制节点"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={onDuplicate}
            >
                <IconCopy size={16} />
            </button>

            <button
                type="button"
                title="删除节点"
                aria-label="删除节点"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                onClick={onDelete}
            >
                <IconTrash size={16} />
            </button>
        </div>
    )
}
