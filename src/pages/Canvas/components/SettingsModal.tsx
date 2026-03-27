import { IconBolt, IconDownload, IconRestore, IconUpload, IconX } from '@tabler/icons-react'
import { useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Modal, ModalContent, ModalDescription, ModalTitle } from '@/components/ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CANVAS_CHAT_MODELS } from '@/constants/ai-models'
import { CANVAS_CHAT_PERSONAS, NO_CHAT_PERSONA_ID } from '@/constants/chat-personas'
import { useChatSettingsStore } from '@/store/chatSettingsStore'
import { Switch } from '@/components/ui/switch'
import { useCanvasFlowStore } from '@/store/canvasFlowStore'
import useMessage from '@/hooks/useMessage'
import { cn } from '@/utils/utils'

type SettingsModalProps = {
    open: boolean
    onClose: () => void
}

const settingSections = [
    { id: 'general', label: '通用设置' },
    { id: 'canvas', label: '画布设置' },
    { id: 'interaction', label: '节点交互' },
    { id: 'ai', label: 'AI 助手' },
    { id: 'collab', label: '协作通知' },
    { id: 'data', label: '数据与版本' },
    { id: 'shortcuts', label: '快捷键' },
    { id: 'labs', label: '实验功能' },
    { id: 'about', label: '关于支持' },
]

const sectionPlaceholderMap = {
    general: [
        { label: '自动保存', type: 'toggle' },
    ],
    canvas: [
        { label: '网格显示', type: 'toggle' },
        { label: '吸附网格', type: 'toggle' },
    ],
    interaction: [
        { label: '拖拽辅助线', type: 'toggle' },
    ],
    ai: [],
    collab: [
        { label: '@我提醒', type: 'toggle' },
    ],
    data: [
        { label: '自动备份', type: 'toggle' },
    ],
    shortcuts: [
        { label: '开启单键模式', type: 'toggle' },
        { label: '冲突提示', type: 'toggle' },
    ],
    labs: [
        { label: 'Beta 功能总开关', type: 'toggle' },
        { label: '轻量渲染模式', type: 'toggle' },
    ],
    about: [],
}

const sectionIdSet = new Set(settingSections.map((item) => item.id))

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
    const [activeSection, setActiveSection] = useState(settingSections[0].id)
    const { defaultModel, defaultPersonaId, autoSaveEnabled, gridVisible, nodeSearchVisible, setDefaultModel, setDefaultPersonaId, setAutoSaveEnabled, setGridVisible, setNodeSearchVisible, resetToDefault } = useChatSettingsStore()
    const { success, error } = useMessage()
    const exportCanvasData = useCanvasFlowStore((state) => state.exportCanvasData)
    const importCanvasData = useCanvasFlowStore((state) => state.importCanvasData)

    // 导入确认弹窗状态
    const [importConfirmOpen, setImportConfirmOpen] = useState(false)
    const [pendingImportData, setPendingImportData] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentSectionItems = useMemo(() => {
        if (!sectionIdSet.has(activeSection)) {
            return []
        }

        return sectionPlaceholderMap[activeSection as keyof typeof sectionPlaceholderMap] ?? []
    }, [activeSection])

    // 导出画布数据
    const handleExport = () => {
        const data = exportCanvasData()
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `canvas-${Date.now()}.json`
        link.click()
        URL.revokeObjectURL(url)
        success('导出成功')
    }

    // 触发文件选择
    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    // 读取文件并弹出确认框
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string)
                setPendingImportData(data)
                setImportConfirmOpen(true)
            } catch {
                error('JSON 文件格式错误')
            }
        }
        reader.readAsText(file)
        event.target.value = ''
    }

    // 确认导入
    const handleConfirmImport = () => {
        if (pendingImportData) {
            importCanvasData(pendingImportData)
            success('导入成功')
        }
        setImportConfirmOpen(false)
        setPendingImportData(null)
    }

    return (
        <>
        <Modal open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
            <ModalContent aria-label="设置弹窗">
                <div className="flex h-[min(76vh,720px)] flex-col">
                    <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <ModalTitle>画布设置中心</ModalTitle>
                            <ModalDescription>当前均为占位配置，后续可逐项接入真实能力。</ModalDescription>
                        </div>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                            onClick={onClose}
                        >
                            <IconX size={18} />
                        </button>
                    </header>

                    <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr]">
                        <aside className="border-r border-slate-200 bg-slate-50/80 p-3">
                            <div className="space-y-1">
                                {settingSections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        className={cn(
                                            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                                            activeSection === section.id
                                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                                : 'text-slate-600 hover:bg-white hover:text-slate-900',
                                        )}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <IconBolt size={14} />
                                        <span>{section.label}</span>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <main className="min-h-0 overflow-auto px-5 py-4">
                            <div className="space-y-3">
                                {/* AI 助手 - 真实配置 */}
                                {activeSection === 'ai' && (
                                    <>
                                        <section className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                            <div className="mb-2 text-sm font-medium text-slate-800">默认模型</div>
                                            <Select value={defaultModel} onValueChange={setDefaultModel}>
                                                <SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-700">
                                                    <SelectValue placeholder="请选择模型" />
                                                </SelectTrigger>
                                                <SelectContent align="end" className="max-h-60">
                                                    {CANVAS_CHAT_MODELS.map((m) => (
                                                        <SelectItem key={m.model} value={m.model}>
                                                            {m.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </section>

                                        <section className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                            <div className="mb-2 text-sm font-medium text-slate-800">默认人设</div>
                                            <Select value={defaultPersonaId} onValueChange={(v) => setDefaultPersonaId(v as typeof defaultPersonaId)}>
                                                <SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-700">
                                                    <SelectValue placeholder="请选择人设" />
                                                </SelectTrigger>
                                                <SelectContent align="end">
                                                    <SelectItem value={NO_CHAT_PERSONA_ID}>无（默认）</SelectItem>
                                                    {CANVAS_CHAT_PERSONAS.map((persona) => (
                                                        <SelectItem key={persona.id} value={persona.id}>
                                                            {persona.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </section>
                                    </>
                                )}

                                {/* 通用设置 - 自动保存开关 */}
                                {activeSection === 'general' && (
                                    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">自动保存</div>
                                                <div className="text-xs text-slate-500 mt-0.5">新建或删除节点时自动保存画布</div>
                                            </div>
                                            <Switch checked={autoSaveEnabled} onCheckedChange={setAutoSaveEnabled} />
                                        </div>
                                    </section>
                                )}

                                {/* 画布设置 - 网格显示开关 */}
                                {activeSection === 'canvas' && (
                                    <>
                                        <section className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800">网格显示</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">控制画布背景网格线的显示</div>
                                                </div>
                                                <Switch checked={gridVisible} onCheckedChange={setGridVisible} />
                                            </div>
                                        </section>
                                        <section className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800">节点搜索栏显示</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">控制画布右上角节点搜索栏的显示</div>
                                                </div>
                                                <Switch checked={nodeSearchVisible} onCheckedChange={setNodeSearchVisible} />
                                            </div>
                                        </section>
                                    </>
                                )}

                                {/* 数据与版本 - 导入导出 */}
                                {activeSection === 'data' && (
                                    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                        <div className="mb-2 text-sm font-medium text-slate-800">画布数据</div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="blue" onClick={handleExport}>
                                                <IconDownload size={14} />
                                                导出
                                            </Button>
                                            <Button size="sm" onClick={handleImportClick}>
                                                <IconUpload size={14} />
                                                导入
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".json"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </section>
                                )}

                                {currentSectionItems.filter((item) => !(activeSection === 'general' && item.label === '自动保存')).map((item) => (
                                    <section key={item.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                        <div className="mb-2 text-sm font-medium text-slate-800">{item.label}</div>

                                        {item.type === 'toggle' && (
                                            <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">
                                                <span>占位开关（暂不生效）</span>
                                                <span className="rounded-md bg-slate-100 px-2 py-1">OFF</span>
                                            </div>
                                        )}
                                    </section>
                                ))}
                            </div>
                        </main>
                    </div>

                    <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
                        <Button variant="blue" size="sm" onClick={resetToDefault}>
                            <IconRestore size={14} />
                            恢复默认
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={onClose}>
                                取消
                            </Button>
                            <Button size="sm" variant="blue" onClick={onClose}>
                                保存
                            </Button>
                        </div>
                    </footer>
                </div>
            </ModalContent>
        </Modal>

        {/* 导入确认弹窗 */}
        <Dialog open={importConfirmOpen} onOpenChange={setImportConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>确认导入</DialogTitle>
                    <DialogDescription>
                        导入将覆盖当前画布的所有内容，此操作不可撤销。是否继续？
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button size="sm" onClick={() => setImportConfirmOpen(false)}>取消</Button>
                    <Button size="sm" variant="blue" onClick={handleConfirmImport}>确认导入</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}
