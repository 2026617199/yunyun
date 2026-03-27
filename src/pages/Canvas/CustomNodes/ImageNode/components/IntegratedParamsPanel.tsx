/**
 * 整合参数面板组件
 * 包含画面比例、宽高比、分辨率的可视化选择
 */

import { IconSettings } from '@tabler/icons-react'

import {
    ASPECT_RATIOS,
    IMAGE_RESOLUTIONS,
    IMAGE_SIZES,
} from '@/constants/ai-models'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { AspectRatioIcon } from './AspectRatioIcon'

type IntegratedParamsPanelProps = {
    // 当前画面比例
    size: string
    // 当前宽高比
    aspectRatio: string
    // 当前分辨率
    resolution: string
    // 更新画面比例
    onSizeChange: (value: string) => void
    // 更新宽高比
    onAspectRatioChange: (value: string) => void
    // 更新分辨率
    onResolutionChange: (value: string) => void
}

// 画面比例标签映射
const SIZE_LABELS: Record<string, string> = {
    '256x256': '256',
    '512x512': '512',
    '1024x1024': '1K',
    '1024x1792': '竖版1K',
    '1792x1024': '横版1K',
    '1280x720': '720p',
    '720x1280': '竖版720p',
}

export const IntegratedParamsPanel = ({
    size,
    aspectRatio,
    resolution,
    onSizeChange,
    onAspectRatioChange,
    onResolutionChange,
}: IntegratedParamsPanelProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    unstyled
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
                >
                    <IconSettings size={14} />
                    <span>整合参数</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                side="top"
                className="w-80 border border-neutral-700 bg-neutral-900 p-3 shadow-xl"
            >
                <div className="space-y-4">
                    {/* 宽高比选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-300">
                            宽高比
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ASPECT_RATIOS.map((item) => {
                                const isActive = aspectRatio === item.value
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => onAspectRatioChange(item.value)}
                                        className={cn(
                                            'flex flex-col items-center gap-1 rounded-lg border p-2 transition-all',
                                            isActive
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-neutral-700 bg-neutral-800 hover:border-neutral-500 hover:bg-neutral-750',
                                        )}
                                    >
                                        <AspectRatioIcon
                                            ratio={item.value}
                                            size={28}
                                            active={isActive}
                                        />
                                        <span
                                            className={cn(
                                                'text-[10px]',
                                                isActive ? 'text-blue-400' : 'text-neutral-400',
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 画面比例选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-300">
                            画面比例
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {IMAGE_SIZES.map((item) => {
                                const isActive = size === item.value
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => onSizeChange(item.value)}
                                        className={cn(
                                            'rounded-lg border px-2.5 py-1.5 text-xs transition-all',
                                            isActive
                                                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                                : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-neutral-100',
                                        )}
                                    >
                                        {SIZE_LABELS[item.value] || item.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 分辨率选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-300">
                            分辨率
                        </label>
                        <div className="flex gap-2">
                            {IMAGE_RESOLUTIONS.map((item) => {
                                const isActive = resolution === item.value
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => onResolutionChange(item.value)}
                                        className={cn(
                                            'rounded-lg border px-3 py-1.5 text-xs transition-all',
                                            isActive
                                                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                                : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-neutral-100',
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}