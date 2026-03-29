import { IconEyeSpark } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

type MidjourneyAdvancedPanelProps = {
    pValue: string
    stylize: number
    weird: number
    variability: number
    onPValueChange: (value: string) => void
    onStylizeChange: (value: number) => void
    onWeirdChange: (value: number) => void
    onVariabilityChange: (value: number) => void
}

/**
 * Midjourney 高级选项面板
 * 使用 Popover 触发方式，与"整合参数"交互一致
 * 当用户点击"高级选项"按钮时展开面板
 */
export const MidjourneyAdvancedPanel = ({
    pValue,
    stylize,
    weird,
    variability,
    onPValueChange,
    onStylizeChange,
    onWeirdChange,
    onVariabilityChange,
}: MidjourneyAdvancedPanelProps) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            unstyled
            className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
          >
            <IconEyeSpark size={14} />
            <span>高级选项</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          className="w-72 border border-neutral-700 bg-neutral-900 p-3 shadow-xl"
        >
          <div className="space-y-3">
            {/* P值输入 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">P值</label>
              <Input
                value={pValue}
                onChange={(e) => onPValueChange(e.target.value)}
                placeholder="请输入你的P值"
                className="h-8 border-neutral-700 bg-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-500"
              />
            </div>

            {/* 风格化程度滑动块 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300">风格化程度</label>
                <span className="text-xs text-neutral-400">{stylize}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={stylize}
                onChange={(e) => onStylizeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* 怪异度滑动块 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300">怪异度</label>
                <span className="text-xs text-neutral-400">{weird}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weird}
                onChange={(e) => onWeirdChange(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* 多样性滑动块 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300">多样性</label>
                <span className="text-xs text-neutral-400">{variability}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={variability}
                onChange={(e) => onVariabilityChange(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
}
