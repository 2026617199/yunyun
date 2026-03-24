import { IconBolt, IconDeviceFloppy, IconInfoCircle, IconRestore, IconX } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Modal, ModalContent, ModalDescription, ModalTitle } from '@/components/ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
        { label: '主题模式', type: 'select', options: ['浅色', '深色', '跟随系统'] },
        { label: '自动保存', type: 'toggle' },
        { label: '启动行为', type: 'select', options: ['打开上次画布', '新建画布'] },
    ],
    canvas: [
        { label: '网格显示', type: 'toggle' },
        { label: '吸附网格', type: 'toggle' },
        { label: '缩放灵敏度', type: 'select', options: ['低', '中', '高'] },
    ],
    interaction: [
        { label: '双击行为', type: 'select', options: ['编辑标题', '打开详情', '无操作'] },
        { label: '拖拽辅助线', type: 'toggle' },
        { label: '框选行为', type: 'select', options: ['仅节点', '节点 + 连线'] },
    ],
    ai: [
        { label: '默认模型', type: 'select', options: ['gpt-4o-mini', 'claude-3.5-sonnet', 'deepseek-chat'] },
        { label: '失败重试', type: 'select', options: ['0 次', '1 次', '2 次'] },
        { label: '安全等级', type: 'select', options: ['保守', '平衡', '激进'] },
    ],
    collab: [
        { label: '@我提醒', type: 'toggle' },
        { label: '评论通知', type: 'select', options: ['站内通知', '邮件通知'] },
        { label: '分享链接有效期', type: 'select', options: ['24 小时', '7 天', '30 天'] },
    ],
    data: [
        { label: '自动备份', type: 'toggle' },
        { label: '备份保留版本', type: 'select', options: ['5', '10', '20'] },
        { label: '回收站保留时间', type: 'select', options: ['7 天', '30 天', '90 天'] },
    ],
    shortcuts: [
        { label: '快捷键方案', type: 'select', options: ['默认方案', '编辑优先', '开发者模式'] },
        { label: '开启单键模式', type: 'toggle' },
        { label: '冲突提示', type: 'toggle' },
    ],
    labs: [
        { label: 'Beta 功能总开关', type: 'toggle' },
        { label: '轻量渲染模式', type: 'toggle' },
        { label: '布局实验策略', type: 'select', options: ['A/B 策略 A', 'A/B 策略 B'] },
    ],
    about: [
        { label: '当前版本', type: 'info', value: 'v0.0.0-placeholders' },
        { label: '更新日志', type: 'action', actionLabel: '查看（占位）' },
        { label: '问题反馈', type: 'action', actionLabel: '提交（占位）' },
    ],
}

const sectionIdSet = new Set(settingSections.map((item) => item.id))

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
    const [activeSection, setActiveSection] = useState(settingSections[0].id)

    const currentSectionItems = useMemo(() => {
        if (!sectionIdSet.has(activeSection)) {
            return []
        }

        return sectionPlaceholderMap[activeSection as keyof typeof sectionPlaceholderMap] ?? []
    }, [activeSection])

    return (
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
                                {currentSectionItems.map((item) => (
                                    <section key={item.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                        <div className="mb-2 text-sm font-medium text-slate-800">{item.label}</div>

                                        {item.type === 'toggle' && (
                                            <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">
                                                <span>占位开关（暂不生效）</span>
                                                <span className="rounded-md bg-slate-100 px-2 py-1">OFF</span>
                                            </div>
                                        )}

                                        {item.type === 'select' && (
                                            <Select value={item.options[0]} onValueChange={() => undefined}>
                                                <SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-700">
                                                    <SelectValue placeholder="请选择" />
                                                </SelectTrigger>
                                                <SelectContent align="end">
                                                    {item.options.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}

                                        {item.type === 'info' && (
                                            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                                                <IconInfoCircle size={14} />
                                                <span>{item.value}</span>
                                            </div>
                                        )}

                                        {item.type === 'action' && (
                                            <Button size="sm" variant="blue" onClick={() => undefined}>
                                                {item.actionLabel}
                                            </Button>
                                        )}
                                    </section>
                                ))}
                            </div>
                        </main>
                    </div>

                    <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
                        <Button variant="blue" size="sm" onClick={() => undefined}>
                            <IconRestore size={14} />
                            恢复默认（占位）
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={onClose}>
                                取消
                            </Button>
                            <Button size="sm" variant="blue" onClick={() => undefined}>
                                <IconDeviceFloppy size={14} />
                                保存（占位）
                            </Button>
                        </div>
                    </footer>
                </div>
            </ModalContent>
        </Modal>
    )
}
