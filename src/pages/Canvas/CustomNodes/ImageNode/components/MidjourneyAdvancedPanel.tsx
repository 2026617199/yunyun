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
  onPValueChange: (value: string) => void
}

/**
 * Midjourney 高级选项面板
 * 使用 Popover 触发方式，与"整合参数"交互一致
 * 当用户点击"高级选项"按钮时展开面板
 */
export const MidjourneyAdvancedPanel = ({
  pValue,
  onPValueChange,
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
          className="w-100 border border-neutral-700 bg-neutral-900 p-3 shadow-xl"
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
          </div>
        </PopoverContent>
      </Popover>
    )
}
