import { useCallback, useState } from 'react'
import {
    ReactFlowProvider,
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
} from '@xyflow/react'

import type {
    AllNodeType,
    EdgeType
} from "@/types/flow";

// 初始节点数据
const initialNodes: AllNodeType[] = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: '节点 1' },
        type: 'default',
    },
    {
        id: '2',
        position: { x: 400, y: 100 },
        data: { label: '节点 2' },
        type: 'default',
    },
]

// 初始边数据
const initialEdges: EdgeType[] = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
    },
]

// 画布组件
const Canvas = () => {
    // 节点状态
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    // 边状态
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    // 处理连接事件
    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge(connection, eds))
        },
        [setEdges]
    )

    return (
        <div className="h-screen w-screen">
            <ReactFlow<AllNodeType, EdgeType>
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    )
}

// 外部组件 - 提供 ReactFlowProvider
export default function CanvasPage() {
    return (
        <ReactFlowProvider>
            <Canvas />
        </ReactFlowProvider>
    )
}
