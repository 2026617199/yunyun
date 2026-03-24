import { NoteNode } from '../CustomNodes/NoteNode'
import { ImageNode } from '../CustomNodes/ImageNode'
import { VideoNode } from '../CustomNodes/VideoNode'
import { AgentNode } from '../CustomNodes/AgentNode'
import type { AgentPresetId } from '@/constants/agent-presets'

/**
 * 自定义节点类型映射
 * 以模块级常量定义，避免高频渲染时重复创建对象
 * 支持四种节点类型：noteNode、imageNode、videoNode、agentNode
 */
export const nodeTypes = {
    noteNode: NoteNode,
    imageNode: ImageNode,
    videoNode: VideoNode,
    agentNode: AgentNode,
}

/**
 * 侧边栏动作到智能体预设 ID 的映射
 */
export const assistantActionToPresetId: Record<string, AgentPresetId> = {
    'novel-to-script-agent': 'novel-to-script-agent',
    'short-video-script-agent': 'short-video-script-agent',
}