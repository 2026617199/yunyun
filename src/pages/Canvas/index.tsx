import { useState } from 'react'
import {
    ReactFlowProvider,
    ColorMode,
    ReactFlow,
} from '@xyflow/react'
import { Layout, Typography, Select, Button, Space, Tooltip, Slider } from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'

// 外部组件 - 提供 ReactFlowProvider 和工具栏
export default function CanvasPage() {
    const [colorMode, setColorMode] = useState<ColorMode>('light')
    const [paneClickDistance, setPaneClickDistance] = useState<number>(1)

    return (
        <Layout className="h-screen w-screen">
            {/* 顶部工具栏 */}
            <Layout.Header className="bg-white/80! backdrop-blur-sm! border-b! border-gray-200! px-4! py-2 flex items-center justify-between z-10">
                <Space align="center" size="large">
                    <Typography.Text strong className="text-lg">画布编辑器</Typography.Text>

                </Space>
                <Space align="center" size="middle">
                    <div className="flex items-center gap-2">
                        <Typography.Text type="secondary" className="text-xs whitespace-nowrap">点击阈值:</Typography.Text>
                        <Slider
                            min={0}
                            max={100}
                            value={paneClickDistance}
                            onChange={(value) => setPaneClickDistance(value)}
                            className="w-24"
                        />
                        <Typography.Text type="secondary" className="text-xs w-6">{paneClickDistance}</Typography.Text>
                    </div>
                    <Select
                        value={colorMode}
                        onChange={(value) => setColorMode(value as ColorMode)}
                        options={[
                            { value: 'dark', label: '深色' },
                            { value: 'light', label: '浅色' },
                            { value: 'system', label: '跟随系统' },
                        ]}
                        className="w-28"
                    />
                    <Tooltip title="刷新">
                        <Button icon={<ReloadOutlined />}>
                            刷新
                        </Button>
                    </Tooltip>
                    <Tooltip title="保存">
                        <Button type="primary" icon={<SaveOutlined />}>
                            保存
                        </Button>
                    </Tooltip>
                    {/* <Tooltip title="运行">
                        <Button icon={<PlayCircleOutlined />}>
                            运行
                        </Button>
                    </Tooltip> */}
                </Space>
            </Layout.Header>

            {/* 画布区域 */}
            <ReactFlowProvider>
                <ReactFlow />/

            </ReactFlowProvider>
        </Layout>
    )
}
