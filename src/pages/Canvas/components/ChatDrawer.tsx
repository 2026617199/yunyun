import { IconPlayerStop, IconSend, IconTrash, IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useResizableWidth } from '@/hooks/useResizableWidth'
import { CANVAS_CHAT_PERSONAS, NO_CHAT_PERSONA_ID } from '@/constants/chat-personas'
import { useChatSettingsStore } from '@/store/chatSettingsStore'
import { cn } from '@/lib/utils'
import type { ChatPersonaId, NoteGenerationMessage } from '@/types/NoteGeneration'

import { ChatMessageList } from './ChatMessageList'

type ChatDrawerProps = {
    open: boolean
    onClose: () => void
    messages: NoteGenerationMessage[]
    isLoading: boolean
    sendMessage: (payload: { content: string; personaId: ChatPersonaId; model?: string }) => void
    stopMessage: () => void
    clearLocalMessages: () => void
}

export const ChatDrawer = ({
    open,
    onClose,
    messages,
    isLoading,
    sendMessage,
    stopMessage,
    clearLocalMessages,
}: ChatDrawerProps) => {
    const { width, isResizing, handlePointerDown } = useResizableWidth()
    const { defaultPersonaId } = useChatSettingsStore()

    const [inputValue, setInputValue] = useState('')
    const [selectedPersonaId, setSelectedPersonaId] = useState<ChatPersonaId>(defaultPersonaId)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // 同步 store 中的默认值
    useEffect(() => {
        setSelectedPersonaId(defaultPersonaId)
    }, [defaultPersonaId])

    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // 打开时聚焦输入框
    useEffect(() => {
        if (open) {
            setTimeout(() => textareaRef.current?.focus(), 100)
        }
    }, [open])

    const handleSend = useCallback(() => {
        const content = inputValue.trim()
        if (!content || isLoading) return
        sendMessage({ content, personaId: selectedPersonaId })
        setInputValue('')
    }, [inputValue, isLoading, sendMessage, selectedPersonaId])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
            }
        },
        [handleSend],
    )

    const handleClear = useCallback(() => {
        clearLocalMessages()
        setInputValue('')
    }, [clearLocalMessages])

    return (
        <Drawer open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
            <DrawerContent
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
                    {/* Header */}
                    <header className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
                        <DrawerTitle className="text-neutral-100">AI 对话</DrawerTitle>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                            onClick={onClose}
                        >
                            <IconX size={18} />
                        </button>
                    </header>

                    {/* Persona Selector */}
                    <div className="flex items-center gap-2 border-b border-neutral-700/60 px-4 py-2">
                        <Select
                            value={selectedPersonaId}
                            onValueChange={(v) => setSelectedPersonaId(v as ChatPersonaId)}
                        >
                            <SelectTrigger className="h-8 flex-1 border-neutral-600 bg-neutral-800 text-xs text-neutral-200">
                                <SelectValue placeholder="选择人设" />
                            </SelectTrigger>
                            <SelectContent align="start">
                                <SelectItem value={NO_CHAT_PERSONA_ID}>无（默认）</SelectItem>
                                {CANVAS_CHAT_PERSONAS.map((persona) => (
                                    <SelectItem key={persona.id} value={persona.id}>
                                        {persona.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <button
                            type="button"
                            title="清空对话"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                            onClick={handleClear}
                        >
                            <IconTrash size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <ChatMessageList messages={messages} isLoading={isLoading} />
                    <div ref={messagesEndRef} />

                    {/* Input Area */}
                    <div className="border-t border-neutral-700 p-3">
                        <div className="flex items-end gap-2">
                            <Textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="输入消息… (Enter 发送，Shift+Enter 换行)"
                                rows={1}
                                className="min-h-30 max-h-60 resize-none "
                                disabled={isLoading}
                            />
                            {isLoading ? (
                                <button
                                    type="button"
                                    title="停止生成"
                                    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-500"
                                    onClick={stopMessage}
                                >
                                    <IconPlayerStop size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    title="发送"
                                    className={cn(
                                        'flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-lg text-white transition-colors',
                                        inputValue.trim()
                                            ? 'bg-blue-600 hover:bg-blue-500'
                                            : 'bg-neutral-700 text-neutral-500',
                                    )}
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                >
                                    <IconSend size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
