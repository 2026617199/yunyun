import { Position, type NodeProps } from '@xyflow/react'
import { memo } from 'react'

import { ButtonHandle } from '@/components/button-handle'
import { Button } from '@/components/ui/button'
import { getAgentPresetLabelById } from '@/constants/agent-presets'
import { useAgentExecution } from '@/hooks/useAgentExecution'
import type { AgentNodeType } from '@/types/flow'

const areAgentNodePropsEqual = (prev: NodeProps<AgentNodeType>, next: NodeProps<AgentNodeType>) => {
    return (
        prev.id === next.id
        && prev.selected === next.selected
        && prev.data.model === next.data.model
        && prev.data.agentPresetId === next.data.agentPresetId

        // 这里是应用比较哎
        && prev.data.messages === next.data.messages
    )
}

export const AgentNode = memo(({ id, data, selected }: NodeProps<AgentNodeType>) => {
    const handleVisibilityClass = selected
        ? 'visible opacity-100'
        : 'invisible opacity-0 group-hover/node:visible group-hover/node:opacity-100'
    const { isGenerating, execute } = useAgentExecution({
        nodeId: id,
        model: data.model,
        messages: data.messages,
    })
    const presetLabel = getAgentPresetLabelById(data.agentPresetId)

    return (
        <div className="group/node relative">
            <ButtonHandle
                type="target"
                position={Position.Left}
                id="input"
                visible
                className={`transition-opacity duration-150 ${handleVisibilityClass}`}
            />

            <ButtonHandle
                type="source"
                position={Position.Right}
                id="output"
                visible
                className={`transition-opacity duration-150 ${handleVisibilityClass}`}
            />

            <div
                className="relative flex h-48 w-48 items-center justify-center rounded-xl border bg-card  shadow-sm transition-transform duration-200 ease-in-out"
            >
                <span className="absolute left-2 top-2 max-w-40 truncate rounded-md border bg-muted px-2 py-0.5 text-[11px] leading-4 text-muted-foreground">
                    {presetLabel}
                </span>
                <Button disabled={isGenerating} onClick={execute}>
                    {isGenerating ? '生成中...' : '生成'}
                </Button>
            </div>
        </div>
    )
}, areAgentNodePropsEqual)

AgentNode.displayName = 'AgentNode'