import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'

import { FloatingSidebar } from './FloatingSidebar'
import type { FloatingSidebarProps } from './FloatingSidebar'
import { assistantActionToPresetId } from '../constants/canvasConfig'
import { useCanvasFlowStore } from '@/store/canvasFlowStore'
import type { AllNodeType, EdgeType } from '@/types/flow'

export const CanvasSidebar = () => {
    const addNode = useCanvasFlowStore((state) => state.addNode)
    const { screenToFlowPosition } = useReactFlow<AllNodeType, EdgeType>()

    const handleSidebarAction = useCallback<NonNullable<FloatingSidebarProps['onAction']>>(
        (actionId) => {
            const centerFlowPosition = screenToFlowPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            })

            switch (actionId) {
                case 'create-note':
                    addNode('note', centerFlowPosition)
                    break
                case 'create-image':
                    addNode('image', centerFlowPosition)
                    break
                case 'create-video':
                    addNode('video', centerFlowPosition)
                    break
                default:
                    if (assistantActionToPresetId[actionId]) {
                        addNode('agent', centerFlowPosition, {
                            agentPresetId: assistantActionToPresetId[actionId],
                        })
                    }
                    break
            }
        },
        [addNode, screenToFlowPosition]
    )

    return <FloatingSidebar onAction={handleSidebarAction} />
}