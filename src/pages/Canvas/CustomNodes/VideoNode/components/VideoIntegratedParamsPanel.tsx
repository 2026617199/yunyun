/**
 * 视频节点整合参数面板组件
 * 包含画面比例、视频尺寸、视频时长的可视化选择
 */

import { IconSettings } from '@tabler/icons-react'

import {
    VIDEO_ASPECT_RATIOS,
    VIDEO_DURATION_CONFIG,
} from '@/constants/ai-models'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { AspectRatioIcon } from '../../ImageNode/components/AspectRatioIcon'

type VideoIntegratedParamsPanelProps = {
    // 当前画面比例
    aspectRatio: string
    // 当前视频尺寸
    videoSize: string
    // 当前视频时长
    duration: number
    // 更新画面比例
    onAspectRatioChange: (value: string) => void
    // 更新视频尺寸
    onVideoSizeChange: (value: string) => void
    // 更新视频时长
    onDurationChange: (value: number) => void
}

// 视频尺寸选项
const VIDEO_SIZE_OPTIONS = [
    { label: '1280×720', value: '1280x720', desc: '横版720p' },
    { label: '720×1280', value: '720x1280', desc: '竖版720p' },
    { label: '1024×1024', value: '1024x1024', desc: '方形' },
] as const

// 时长预设选项
const DURATION_PRESETS = [0, 5, 10, 15, 20, 25] as const

export const VideoIntegratedParamsPanel = ({
    aspectRatio,
    videoSize,
    duration,
    onAspectRatioChange,
    onVideoSizeChange,
    onDurationChange,
}: VideoIntegratedParamsPanelProps) => {
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
                    {/* 画面比例选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-300">
                            画面比例
                        </label>
                        <div className="flex gap-2">
                            {VIDEO_ASPECT_RATIOS.map((item) => {
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

                    {/* 视频尺寸选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-300">
                            视频尺寸
                        </label>
                        <div className="flex gap-2">
                            {VIDEO_SIZE_OPTIONS.map((item) => {
                                const isActive = videoSize === item.value
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => onVideoSizeChange(item.value)}
                                        className={cn(
                                            'flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2 transition-all',
                                            isActive
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-neutral-700 bg-neutral-800 hover:border-neutral-500 hover:bg-neutral-750',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'text-xs',
                                                isActive ? 'text-blue-400' : 'text-neutral-300',
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-[10px]',
                                                isActive ? 'text-blue-400/70' : 'text-neutral-500',
                                            )}
                                        >
                                            {item.desc}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 视频时长选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-300">
                            视频时长（秒）
                        </label>
                        <div className="space-y-2">
                            {/* 时长预设按钮 */}
                            <div className="flex flex-wrap gap-2">
                                {DURATION_PRESETS.map((preset) => {
                                    const isActive = duration === preset
                                    return (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => onDurationChange(preset)}
                                            className={cn(
                                                'rounded-lg border px-2.5 py-1.5 text-xs transition-all',
                                                isActive
                                                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                                    : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-neutral-100',
                                            )}
                                        >
                                            {preset === 0 ? '自动' : `${preset}s`}
                                        </button>
                                    )
                                })}
                            </div>
                            {/* 时长滑块 */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min={VIDEO_DURATION_CONFIG.min}
                                    max={VIDEO_DURATION_CONFIG.max}
                                    step={VIDEO_DURATION_CONFIG.step}
                                    value={duration}
                                    onChange={(event) => {
                                        const next = Number(event.target.value)
                                        if (!Number.isNaN(next)) {
                                            onDurationChange(next)
                                        }
                                    }}
                                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                                />
                                <span className="min-w-[40px] rounded bg-neutral-800 px-2 py-1 text-center text-xs text-neutral-300">
                                    {duration === 0 ? '自动' : `${duration}s`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}