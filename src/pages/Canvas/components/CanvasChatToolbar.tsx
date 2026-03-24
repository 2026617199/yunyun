import { IconChevronUp, IconMessageCircle, IconUserCog } from '@tabler/icons-react'
import { useMemo } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CANVAS_CHAT_PERSONAS, NO_CHAT_PERSONA_ID } from '@/constants/chat-personas'
import { cn } from '@/utils/utils'
import type { ChatPersonaId } from '@/types/NoteGeneration'

type CanvasChatToolbarProps = {
    selectedPersonaId: ChatPersonaId
    onSelectPersona: (personaId: ChatPersonaId) => void
    onOpenChat: () => void
    isChatOpen?: boolean
}

const PERSONA_NONE_ITEM = {
    id: NO_CHAT_PERSONA_ID,
    label: '默认对话（无人设）',
}

export const CanvasChatToolbar = ({
    selectedPersonaId,
    onSelectPersona,
    onOpenChat,
    isChatOpen,
}: CanvasChatToolbarProps) => {
    const personaOptions = useMemo(() => {
        return [PERSONA_NONE_ITEM, ...CANVAS_CHAT_PERSONAS.map((item) => ({ id: item.id, label: item.label }))]
    }, [])

    const selectedPersonaLabel = useMemo(() => {
        return personaOptions.find((item) => item.id === selectedPersonaId)?.label ?? PERSONA_NONE_ITEM.label
    }, [personaOptions, selectedPersonaId])

    return (
        <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-[0_14px_36px_rgba(15,23,42,0.2)]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            title="选择对话人设"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                        >
                            <IconUserCog size={20} />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" sideOffset={10} className="w-64 min-w-64">
                        <DropdownMenuLabel>对话人设</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={selectedPersonaId}
                            onValueChange={(value) => onSelectPersona(value as ChatPersonaId)}
                        >
                            {personaOptions.map((option) => (
                                <DropdownMenuRadioItem key={option.id} value={option.id}>
                                    {option.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <button
                    type="button"
                    title="打开 AI 对话"
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(37,99,235,0.45)] transition-transform hover:scale-105',
                        isChatOpen ? 'bg-blue-500' : 'bg-blue-600',
                    )}
                    onClick={onOpenChat}
                >
                    <IconMessageCircle size={22} />
                </button>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1.5 text-[11px] text-white backdrop-blur-md">
                <IconChevronUp size={12} />
                <span>{selectedPersonaLabel}</span>
            </div>
        </div>
    )
}
