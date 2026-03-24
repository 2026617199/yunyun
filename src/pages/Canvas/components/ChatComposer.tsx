import { IconSend2 } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

type ChatComposerProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => Promise<void> | void
    disabled?: boolean
    loading?: boolean
}

export const ChatComposer = ({
    value,
    onChange,
    onSubmit,
    disabled = false,
    loading = false,
}: ChatComposerProps) => {
    const canSend = value.trim().length > 0 && !disabled && !loading

    return (
        <footer className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-end gap-2">
                <textarea
                    value={value}
                    rows={3}
                    placeholder="输入你的问题..."
                    className="max-h-40 min-h-22 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    onChange={(event) => onChange(event.target.value)}
                />

                <Button type="button" size="sm" variant="blue" disabled={!canSend} loading={loading} onClick={onSubmit}>
                    <IconSend2 size={16} />
                </Button>
            </div>
        </footer>
    )
}
