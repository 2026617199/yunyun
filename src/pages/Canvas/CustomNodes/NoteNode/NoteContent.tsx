import Markdown from 'react-markdown'

type NoteContentProps = {
    content: string
    isEditing: boolean
    onStartEdit: () => void
    onStopEdit: () => void
    onContentBlur: (value: string) => void
}

// 文本内容区：负责"编辑态 textarea"与"预览态 markdown"切换。
export const NoteContent = ({
    content,
    isEditing,
    onStartEdit,
    onStopEdit,
    onContentBlur,
}: NoteContentProps) => {
    if (isEditing) {
        return (
            <textarea
                defaultValue={content}
                maxLength={2500}
                placeholder="双击开始输入或编辑 Markdown..."
                className="note-scrollbar noflow nopan nodrag nowheel h-full w-full resize-none rounded-md border-0 bg-[#1f1f1f] p-2 text-sm text-white outline-none ring-0 placeholder:text-white/70"
                onBlur={(event) => {
                    onContentBlur(event.target.value)
                    onStopEdit()
                }}
            />
        )
    }

    return (
        <div
            className="note-scrollbar noflow nopan nowheel h-full w-full overflow-auto rounded-md bg-[#1f1f1f] p-2 text-2xl prose prose-sm max-w-none text-white"
            onDoubleClick={onStartEdit}
        >
            {content ? (
                <Markdown>{content}</Markdown>
            ) : (
                    <div className="opacity-70 text-white">双击开始输入或编辑 Markdown...</div>
            )}
        </div>
    )
}
