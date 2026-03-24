import { IconAt, IconCommand, IconPhoto, IconSparkles, IconUpload, IconWand } from '@tabler/icons-react'
import Mention from '@tiptap/extension-mention'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
    IMAGE_MODELS,
    IMAGE_RESOLUTIONS,
    IMAGE_SIZES,
} from '@/constants/ai-models'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/api/ai'
import { GenerationStatus } from '@/constants/enum'
import useMessage from '@/hooks/useMessage'
import { cn } from '@/lib/utils'
import { useCanvasFlowStore } from '@/store/canvasFlowStore'
import type { ImageGenerationNode, NoteNodeData } from '@/types/flow'

import { COMMAND_MOCK, MENTION_MOCK, STYLE_TEMPLATE_MOCK } from './mock'

/**
 * 图片节点底部增强输入区
 * 职责：
 * - 上区：展示参考图列表（mock）
 * - 中区：基于 tiptap 的富文本输入（最小可用）
 *   - 支持 @ 引用 mock 建议
 *   - 支持 / 命令 mock 建议
 * - 下区：参数控制（比例、分辨率、模型、风格模板）
 *
 * 说明：
 * - 本期所有状态均本地 useState 管理，后续可替换为 store/api。
 */
export const ImagePromptPanel = ({ nodeId }: { nodeId: string }) => {
    const [ratio, setRatio] = useState('1024x1024')
    const [resolution, setResolution] = useState('2K')
    const [model, setModel] = useState('doubao-seedream-4-0')
    const [templateId, setTemplateId] = useState<string>(STYLE_TEMPLATE_MOCK[0].id)
    // 上传成功后的参考图 URL（本地态即可，后续可迁移到 store）
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    // 上传中态，避免重复上传触发
    const [isUploading, setIsUploading] = useState(false)

    const [mentionQuery, setMentionQuery] = useState('')
    const [commandQuery, setCommandQuery] = useState('')
    const [activeMode, setActiveMode] = useState<'mention' | 'command' | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    // 消息提示（成功/失败/警告）
    const { success, error, warning } = useMessage()

    // 画布数据：用于沿边查找父节点
    const nodes = useCanvasFlowStore((state) => state.nodes)
    const edges = useCanvasFlowStore((state) => state.edges)
    const startImageGeneration = useCanvasFlowStore((state) => state.startImageGeneration)

    // 当前节点状态（用于禁用生成按钮）
    const currentNode = useMemo(() => {
        return nodes.find((node) => node.id === nodeId)
    }, [nodes, nodeId])

    const resetSuggestionState = () => {
        setActiveMode(null)
        setMentionQuery('')
        setCommandQuery('')
        setActiveIndex(0)
        triggerRangeRef.current = null
    }

    const getMentionLabel = (attrs: { id?: string; label?: string; value?: string }) => {
        return attrs.label || attrs.value || attrs.id || ''
    }

    const disableBuiltInSuggestion = {
        items: () => [],
        render: () => ({
            onStart: () => { },
            onUpdate: () => { },
            onKeyDown: () => false,
            onExit: () => { },
        }),
    }

    const mentionExtension = useMemo(() => {
        return Mention.configure({
            deleteTriggerWithBackspace: true,
            HTMLAttributes: {
                class: 'image-node-mention-pill',
            },
            renderText({ options, node }) {
                const mentionLabel = getMentionLabel(node.attrs)
                return `${options.suggestion.char}${mentionLabel}`
            },
            renderHTML({ options, node }) {
                const mentionLabel = getMentionLabel(node.attrs)
                return [
                    'span',
                    {
                        ...options.HTMLAttributes,
                        'data-mention-id': node.attrs.id,
                        'data-mention-value': node.attrs.value,
                        'data-mention-label': mentionLabel,
                        contenteditable: 'false',
                    },
                    `${options.suggestion.char}${mentionLabel}`,
                ]
            },
            // 这里禁用内建 suggestion UI，改为当前组件自己的下拉面板实现
            suggestion: {
                char: '@',
                ...disableBuiltInSuggestion,
            },
        })
    }, [])

    const slashCommandExtension = useMemo(() => {
        return Mention.extend({
            name: 'slashCommand',
        }).configure({
            deleteTriggerWithBackspace: true,
            HTMLAttributes: {
                class: 'image-node-slash-pill',
            },
            renderText({ options, node }) {
                const mentionLabel = getMentionLabel(node.attrs)
                return `${options.suggestion.char}${mentionLabel}`
            },
            renderHTML({ options, node }) {
                const mentionLabel = getMentionLabel(node.attrs)
                return [
                    'span',
                    {
                        ...options.HTMLAttributes,
                        'data-mention-id': node.attrs.id,
                        'data-mention-value': node.attrs.value,
                        'data-mention-label': mentionLabel,
                        contenteditable: 'false',
                    },
                    `${options.suggestion.char}${mentionLabel}`,
                ]
            },
            suggestion: {
                char: '/',
                ...disableBuiltInSuggestion,
            },
        })
    }, [])

    // 用于粗粒度识别当前触发词位置，便于替换 @xxx 或 /xxx
    const triggerRangeRef = useRef<{ from: number; to: number } | null>(null)
    // 上传按钮对应的隐藏 input
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const insertSuggestionNode = (
        mode: 'mention' | 'command',
        item: (typeof MENTION_MOCK)[number] | (typeof COMMAND_MOCK)[number],
    ) => {
        if (!triggerRangeRef.current) {
            return
        }

        if (mode === 'mention') {
            const selected = item as (typeof MENTION_MOCK)[number]
            editor
                ?.chain()
                .focus()
                .insertContentAt(triggerRangeRef.current, [
                    {
                        type: 'mention',
                        attrs: {
                            id: selected.id,
                            label: selected.label,
                            value: selected.value,
                        },
                    },
                    {
                        type: 'text',
                        text: ' ',
                    },
                ])
                .run()
            return
        }

        const selected = item as (typeof COMMAND_MOCK)[number]
        const commandValue = selected.command.replace(/^\//, '')
        editor
            ?.chain()
            .focus()
            .insertContentAt(triggerRangeRef.current, [
                {
                    type: 'slashCommand',
                    attrs: {
                        id: selected.id,
                        label: selected.label,
                        value: commandValue,
                    },
                },
                {
                    type: 'text',
                    text: ' ',
                },
            ])
            .run()
    }

    const filteredMentionItems = useMemo(() => {
        const q = mentionQuery.trim().toLowerCase()
        const all = [...MENTION_MOCK]
        if (!q) {
            return all
        }
        return all.filter((item) => {
            return (
                item.label.toLowerCase().includes(q) ||
                item.value.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
            )
        })
    }, [mentionQuery])

    const filteredCommandItems = useMemo(() => {
        const q = commandQuery.trim().toLowerCase()
        const all = [...COMMAND_MOCK]
        if (!q) {
            return all
        }
        return all.filter((item) => {
            return (
                item.label.toLowerCase().includes(q) ||
                item.command.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
            )
        })
    }, [commandQuery])

    const currentTemplate = useMemo(() => {
        return STYLE_TEMPLATE_MOCK.find((item) => item.id === templateId) ?? STYLE_TEMPLATE_MOCK[0]
    }, [templateId])

    // 沿着边找所有父节点，并合并其图片结果作为参考图来源
    const parentImageUrls = useMemo(() => {
        const parentIds = edges
            .filter((edge) => edge.target === nodeId)
            .map((edge) => edge.source)

        if (parentIds.length === 0) {
            return [] as string[]
        }

        const urls: string[] = []

        parentIds.forEach((parentId) => {
            const parentNode = nodes.find((node) => node.id === parentId)
            if (!parentNode || parentNode.type !== 'imageNode') {
                return
            }

            const parentData = parentNode.data as ImageGenerationNode
            parentData.result?.data?.forEach((item) => {
                if (item?.url) {
                    urls.push(item.url)
                }
            })
        })

        return urls
    }, [edges, nodes, nodeId])

    // 收集父级便签内容：按入边顺序去重后提取 content
    const parentNoteContents = useMemo(() => {
        const orderedParentIds: string[] = []
        const seenParentIds = new Set<string>()

        edges.forEach((edge) => {
            if (edge.target !== nodeId || seenParentIds.has(edge.source)) {
                return
            }

            seenParentIds.add(edge.source)
            orderedParentIds.push(edge.source)
        })

        return orderedParentIds
            .map((parentId) => nodes.find((node) => node.id === parentId))
            .filter((node) => node?.type === 'noteNode')
            .map((node) => (node?.data as NoteNodeData).content?.trim())
            .filter((content) => Boolean(content)) as string[]
    }, [edges, nodes, nodeId])

    // 参考图列表：上传图片 + 父节点结果（不去重，默认顺序）
    const referenceImageUrls = useMemo(() => {
        return [...uploadedUrls, ...parentImageUrls]
    }, [uploadedUrls, parentImageUrls])

    // 是否正在生成（用于按钮禁用态）
    const isGenerating = useMemo(() => {
        if (!currentNode || currentNode.type !== 'imageNode') {
            return false
        }

        const status = currentNode.data.status
        return status === GenerationStatus.IN_PROGRESS || status === GenerationStatus.QUEUED
    }, [currentNode])

    // 触发上传选择
    const handleUploadClick = () => {
        if (isUploading) {
            return
        }
        fileInputRef.current?.click()
    }

    // 上传图片并回填到参考图列表
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('purpose', 'generation')

        setIsUploading(true)

        try {
            const response = await uploadImage(formData)
            const nextUrl = response?.data?.url

            if (!nextUrl) {
                warning('上传成功但未返回图片地址')
                return
            }

            setUploadedUrls((prev) => [...prev, nextUrl])
            success('上传成功')
        } catch (uploadError) {
            console.error('上传图片失败:', uploadError)
            error('上传失败，请重试')
        } finally {
            setIsUploading(false)
            event.target.value = ''
        }
    }

    const editor = useEditor({
        extensions: [StarterKit, mentionExtension, slashCommandExtension],
        content: '<p></p>',
        editorProps: {
            attributes: {
                class: cn(
                    'nodrag nopan nowheel min-h-[88px] max-h-[220px] overflow-y-auto rounded-xl border border-slate-200 bg-white/85 px-3 py-2 text-sm leading-6 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]',
                    'focus:outline-none',
                ),
            },
            handleKeyDown: (_view, event) => {
                const currentItems = activeMode === 'mention' ? filteredMentionItems : filteredCommandItems

                if (!activeMode || currentItems.length === 0) {
                    return false
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setActiveIndex((prev) => (prev + 1) % currentItems.length)
                    return true
                }

                if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setActiveIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length)
                    return true
                }

                if (event.key === 'Escape') {
                    event.preventDefault()
                    resetSuggestionState()
                    return true
                }

                if (event.key === 'Enter') {
                    event.preventDefault()
                    if (activeMode === 'mention') {
                        const selected = filteredMentionItems[activeIndex]
                        if (!selected) {
                            return true
                        }

                        insertSuggestionNode('mention', selected)
                    }

                    if (activeMode === 'command') {
                        const selected = filteredCommandItems[activeIndex]
                        if (!selected) {
                            return true
                        }

                        insertSuggestionNode('command', selected)
                    }

                    resetSuggestionState()
                    return true
                }

                return false
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            const { from } = currentEditor.state.selection
            const plainText = currentEditor.state.doc.textBetween(0, from, '\n', '\0')
            const mentionMatch = plainText.match(/(^|\s)@([^\s@]*)$/)
            const commandMatch = plainText.match(/(^|\s)\/([^\s/]*)$/)

            if (mentionMatch) {
                setActiveMode('mention')
                setMentionQuery(mentionMatch[2] ?? '')
                setCommandQuery('')
                setActiveIndex(0)

                const triggerLength = `@${mentionMatch[2] ?? ''}`.length
                triggerRangeRef.current = {
                    from: Math.max(from - triggerLength, 0),
                    to: from,
                }
                return
            }

            if (commandMatch) {
                setActiveMode('command')
                setCommandQuery(commandMatch[2] ?? '')
                setMentionQuery('')
                setActiveIndex(0)

                const triggerLength = `/${commandMatch[2] ?? ''}`.length
                triggerRangeRef.current = {
                    from: Math.max(from - triggerLength, 0),
                    to: from,
                }
                return
            }

            resetSuggestionState()
        },
    })

    const suggestionItems = activeMode === 'mention' ? filteredMentionItems : filteredCommandItems

    // 点击生成：创建任务并启动轮询
    const handleGenerate = async () => {
        const promptText = editor?.getText().trim() ?? ''
        const mergedPrompt = [...parentNoteContents, promptText]
            .map((content) => content.trim())
            .filter((content) => content.length > 0)
            .join(' ')

        if (!mergedPrompt) {
            warning('请输入提示词')
            return
        }

        const payload: any = {
            model,
            prompt: mergedPrompt,
            size: ratio,
            resolution,
            n: 1,
            image_urls: referenceImageUrls,
            metadata: {
                resolution,
            },
        }

        try {
            await startImageGeneration(nodeId, payload)
            success('已开始生成图片')
        } catch (generationError) {
            console.error('创建图片生成任务失败:', generationError)
            error('创建任务失败，请稍后再试')
        }
    }

    return (
        <div className="nodrag nopan nowheel w-170 rounded-3xl border border-slate-200/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.97)_58%,rgba(241,245,249,0.96)_100%)] p-3 shadow-[0_22px_70px_rgba(15,23,42,0.14)] backdrop-blur-md">

            {/* 顶部区域：tiptap 增强输入区 */}
            <div className="relative mb-3 rounded-2xl border border-slate-200/80 bg-white/80 p-2">

                <EditorContent editor={editor} />
                <div className="nodrag nopan nowheel flex gap-2 overflow-x-auto pb-1 mt-2.5">
                    {/* 上传按钮（固定为第一个） */}
                    <button
                        type="button"
                        className="group nodrag nopan nowheel relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white/90 text-slate-500 transition-colors hover:border-indigo-400 hover:text-indigo-600"
                        onClick={handleUploadClick}
                        title={isUploading ? '上传中...' : '上传参考图'}
                        disabled={isUploading}
                    >
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[10px]">
                            <IconUpload size={16} />
                            {isUploading ? '上传中' : '上传'}
                        </div>
                    </button>

                    {/* 隐藏 input，用于触发文件选择 */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* 参考图（上传 + 父节点结果） */}
                    {referenceImageUrls.map((url, index) => (
                        <button
                            key={`${url}-${index}`}
                            type="button"
                            className="group nodrag nopan nowheel relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                            title="参考图"
                        >
                            <img
                                src={url}
                                alt="参考图"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
                {/* 建议面板 */}
                {activeMode && suggestionItems.length > 0 && (
                    <div className="nodrag nopan nowheel absolute right-2 bottom-2 left-2 z-30 max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.16)]">
                        {suggestionItems.map((item, index) => {
                            const isActive = index === activeIndex
                            const title = item.label
                            const desc = item.description
                            const token = activeMode === 'mention' ? `@${item.value}` : item.command

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={cn(
                                        'flex w-full items-start justify-between gap-3 border-b border-slate-100 px-3 py-2 text-left last:border-b-0',
                                        isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50',
                                    )}
                                    onMouseDown={(event) => {
                                        event.preventDefault()
                                        setActiveIndex(index)

                                        if (!triggerRangeRef.current) {
                                            return
                                        }

                                        if (activeMode === 'mention') {
                                            insertSuggestionNode('mention', item)
                                        } else {
                                            insertSuggestionNode('command', item)
                                        }

                                        resetSuggestionState()
                                    }}
                                >
                                    <div>
                                        <div className="text-xs font-medium">{title}</div>
                                        <div className="mt-0.5 text-[11px] text-slate-500">{desc}</div>
                                    </div>
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600">
                                        {token}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* 下方区域：参数控制区 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-2.5">
                <div className="flex items-end gap-2">
                    <div className="space-y-1">
                        <label className="text-[11px] text-slate-500">画面比例</label>
                        <Select value={ratio} onValueChange={setRatio}>
                            <SelectTrigger className="h-8 w-full border-slate-200 bg-white text-xs">
                                <SelectValue placeholder="选择比例" />
                            </SelectTrigger>
                            <SelectContent>
                                {IMAGE_SIZES.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] text-slate-500">分辨率</label>
                        <Select value={resolution} onValueChange={setResolution}>
                            <SelectTrigger className="h-8 w-full border-slate-200 bg-white text-xs">
                                <SelectValue placeholder="选择分辨率" />
                            </SelectTrigger>
                            <SelectContent>
                                {IMAGE_RESOLUTIONS.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] text-slate-500">生成模型</label>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger className="h-8 w-full border-slate-200 bg-white text-xs">
                                <SelectValue placeholder="选择模型" />
                            </SelectTrigger>
                            <SelectContent>
                                {IMAGE_MODELS.map((item) => (
                                    <SelectItem key={item.id} value={item.model}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] text-slate-500">风格模板</label>
                        <Select value={templateId} onValueChange={setTemplateId}>
                            <SelectTrigger className="h-8 w-full border-slate-200 bg-white text-xs">
                                <SelectValue placeholder="选择风格模板" />
                            </SelectTrigger>
                            <SelectContent>
                                {STYLE_TEMPLATE_MOCK.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="ml-auto">
                        <Button
                            type="button"
                            variant="blue"
                            size="sm"
                            loading={isGenerating}
                            onClick={handleGenerate}
                            disabled={isUploading}
                        >
                            生成
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
