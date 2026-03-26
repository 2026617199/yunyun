import { IconX } from '@tabler/icons-react'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useResizableWidth } from '@/hooks/useResizableWidth'
import { cn } from '@/lib/utils'
import type { NoteGenerationMessage } from '@/types/NoteGeneration'

import { ChatMessageList } from './ChatMessageList'

type ChatDrawerProps = {
    open: boolean
    onClose: () => void
    messages: NoteGenerationMessage[]
    isLoading: boolean
}

export const ChatDrawer = ({
    open,
    onClose,
    messages,
    isLoading,
}: ChatDrawerProps) => {
    const { width, isResizing, handlePointerDown } = useResizableWidth()

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
            <DialogContent
                aria-label="AI 对话抽屉"
                className={cn(
                    'border-neutral-700 bg-neutral-900 text-neutral-100 transition-none',
                    isResizing && 'select-none',
                )}
                style={{ width: `${width}px` }}
            >
                {/* Resize Handle */}
                <div
                    className={cn(
                        'absolute top-0 left-0 z-50 h-full w-1 cursor-col-resize transition-colors hover:bg-blue-500/50',
                        isResizing && 'bg-blue-500/50',
                    )}
                    onPointerDown={handlePointerDown}
                />

                <div className="flex h-full flex-col">
                    <header className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
                        <DialogTitle className="text-neutral-100">AI 对话</DialogTitle>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                            onClick={onClose}
                        >
                            <IconX size={18} />
                        </button>
                    </header>

                    <ChatMessageList messages={messages} isLoading={isLoading} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
