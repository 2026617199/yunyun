import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react'
import { create } from 'zustand'

import type { AllNodeType, EdgeType } from '@/types/flow'
import { GenerationStatus } from '@/constants/enum'

/**
 * 节点类型标识符
 */
type NodeType = 'note' | 'image' | 'video'

/**
 * 基于最后一个节点计算新节点位置
 */
const getNextNodePosition = (nodes: AllNodeType[]) => {
  const lastNode = nodes[nodes.length - 1]
  const fallbackPosition = { x: 220, y: 180 }

  return lastNode
    ? {
        x: lastNode.position.x + 40,
        y: lastNode.position.y + 40,
      }
    : fallbackPosition
}

type CanvasFlowState = {
  nodes: AllNodeType[]
  edges: EdgeType[]
  // 各类型节点的自增计数器
  nodeIdCounters: { note: number; image: number; video: number }

  // === 基础流程事件 ===
  onNodesChange: (changes: NodeChange<AllNodeType>[]) => void
  onEdgesChange: (changes: EdgeChange<EdgeType>[]) => void
  onConnect: (connection: Connection) => void

  // === 通用节点操作 ===
  /** 获取下一个指定类型的节点 ID（自增） */
  getNextNodeId: (nodeType: NodeType) => string
  /** 创建节点 */
  addNode: (nodeType: NodeType) => void
  /** 更新便签编辑态 */
  setNoteNodeEditing: (nodeId: string, isEditing: boolean) => void
  /** 更新便签内容 */
  updateNoteNodeContent: (nodeId: string, content: string) => void
  /** 调整节点尺寸 */
  resizeNode: (nodeId: string, width: number, height: number) => void
  /** 复制节点 */
  duplicateNode: (nodeId: string) => void
  /** 删除节点及其关联边 */
  deleteNode: (nodeId: string) => void
}

// ==================== 初始图数据 ====================

/**
 * 模拟图片 URL：使用 picsum.photos 公开服务
 * （生产环境应替换为真实生成的 URL）
 */
const MOCK_IMAGE_URL = 'https://picsum.photos/300/250?random=1'

/**
 * 模拟视频 URL：使用公开的示例视频
 * （生产环境应替换为真实生成的 URL）
 */
const MOCK_VIDEO_URL = 'https://248vz9dlvm.ufs.sh/f/HlpeesVvzNZhbg0rlBhg0QRhzI8K9TPMCB5tkO3JXdn6HxDE'

// 初始图数据：包含默认节点、文本便签、图片节点、视频节点的演示
// 布局规划：
//   第一行（y=100）: 默认节点
//   第二行（y=280）: 便签节点
//   第三行（y=550）: 图片节点（展示不同状态）
//   第四行（y=900）: 视频节点（展示不同状态）
const initialNodes: AllNodeType[] = [
  // ==================== 默认节点 ====================
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

  // ==================== 便签节点 ====================
  {
    id: 'note-initial-1',
    type: 'noteNode',
    position: { x: 120, y: 280 },
    width: 280,
    height: 180,
    data: {
      content: '便签 1：可作为流程备注与上下文说明。',
      inputHandleId: 'input',
      outputHandleId: 'output',
      isEditing: false,
      createdAt: Date.now(),
    },
  },
  {
    id: 'note-initial-2',
    type: 'noteNode',
    position: { x: 520, y: 280 },
    width: 280,
    height: 180,
    data: {
      content: '便签 2：默认与便签 1 建立连接（output -> input）。',
      inputHandleId: 'input',
      outputHandleId: 'output',
      isEditing: false,
      createdAt: Date.now(),
    },
  },
  {
    id: 'note-initial-3',
    type: 'noteNode',
    position: { x: 920, y: 280 },
    width: 280,
    height: 180,
    data: {
      content: '便签 3：展示节点网络拓扑。可以通过拖拽句柄建立新连接。',
      inputHandleId: 'input',
      outputHandleId: 'output',
      isEditing: false,
      createdAt: Date.now(),
    },
  },

  // ==================== 图片节点（展示不同生成状态） ====================
  {
    id: 'image-initial-1',
    type: 'imageNode',
    position: { x: 50, y: 550 },
    width: 350,
    height: 250,
    data: {
      model: 'dall-e-3',
      prompt: '一个科技感的蓝色背景设计',
      status: GenerationStatus.COMPLETED,
      progress: 100,
      result: {
        type: 'image',
        data: [
          {
            url: MOCK_IMAGE_URL,
          },
        ],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'image-initial-2',
    type: 'imageNode',
    position: { x: 450, y: 550 },
    width: 350,
    height: 250,
    data: {
      model: 'stable-diffusion',
      prompt: '星空下的麦田景观艺术',
      status: GenerationStatus.IN_PROGRESS,
      progress: 65,
      result: {
        type: 'image',
        data: [],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'image-initial-3',
    type: 'imageNode',
    position: { x: 850, y: 550 },
    width: 350,
    height: 250,
    data: {
      model: 'gemini-3-pro-image-preview',
      prompt: '现代建筑与自然的融合设计',
      status: GenerationStatus.QUEUED,
      progress: 0,
      result: {
        type: 'image',
        data: [],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'image-initial-4',
    type: 'imageNode',
    position: { x: 1250, y: 550 },
    width: 350,
    height: 250,
    data: {
      model: 'dall-e-3',
      prompt: '丢失的提示词信息',
      status: GenerationStatus.FAILED,
      progress: 0,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: '请求频率过高，请稍后再试',
      },
      result: {
        type: 'image',
        data: [],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'image-initial-5',
    type: 'imageNode',
    position: { x: 1650, y: 550 },
    width: 350,
    height: 250,
    data: {
      model: 'dall-e-3',
      prompt: '日本樱花季风景画',
      status: GenerationStatus.COMPLETED,
      progress: 100,
      result: {
        type: 'image',
        data: [
          {
            url: 'https://picsum.photos/300/250?random=2',
          },
        ],
      },
      createdAt: Date.now(),
    },
  },

  // ==================== 视频节点（展示不同生成状态） ====================
  {
    id: 'video-initial-1',
    type: 'videoNode',
    position: { x: 50, y: 900 },
    width: 400,
    height: 280,
    data: {
      model: 'genai-video',
      prompt: '一只小鹿在森林中奔跑的场景',
      aspect_ratio: '16:9',
      status: GenerationStatus.COMPLETED,
      progress: 100,
      metadata: {
        size: '1280x720',
      },
      result: {
        type: 'video',
        data: [
          {
            url: MOCK_VIDEO_URL,
            format: 'mp4',
          },
        ],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'video-initial-2',
    type: 'videoNode',
    position: { x: 520, y: 900 },
    width: 400,
    height: 280,
    data: {
      model: 'pika-api',
      prompt: '城市街道傍晚的繁忙交通',
      aspect_ratio: '16:9',
      status: GenerationStatus.IN_PROGRESS,
      progress: 45,
      metadata: {
        size: '1920x1080',
      },
      result: {
        type: 'video',
        data: [],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'video-initial-3',
    type: 'videoNode',
    position: { x: 990, y: 900 },
    width: 400,
    height: 280,
    data: {
      model: 'genai-video',
      prompt: '蜂鸟在花丛中飞舞的特写',
      aspect_ratio: '9:16',
      status: GenerationStatus.QUEUED,
      progress: 0,
      metadata: {
        size: '720x1280',
      },
      result: {
        type: 'video',
        data: [],
      },
      createdAt: Date.now(),
    },
  },
  {
    id: 'video-initial-4',
    type: 'videoNode',
    position: { x: 1460, y: 900 },
    width: 400,
    height: 280,
    data: {
      model: 'runway-ml',
      prompt: '错误的请求格式',
      aspect_ratio: '16:9',
      status: GenerationStatus.FAILED,
      progress: 0,
      metadata: {
        size: '1280x720',
      },
      error: {
        code: 'INVALID_PROMPT',
        message: '提示词包含不支持的内容',
      },
      result: {
        type: 'video',
        data: [],
      },
      createdAt: Date.now(),
    },
  },
]

const initialEdges: EdgeType[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e-note-initial-1-note-initial-2',
    source: 'note-initial-1',
    target: 'note-initial-2',
    sourceHandle: 'output',
    targetHandle: 'input',
  },
  {
    id: 'e-note-initial-2-note-initial-3',
    source: 'note-initial-2',
    target: 'note-initial-3',
    sourceHandle: 'output',
    targetHandle: 'input',
  },
]


export const useCanvasFlowStore = create<CanvasFlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  nodeIdCounters: { note: 3, image: 5, video: 4 }, // 初始已有各类型示例节点

  // ==================== 通用方法实现 ====================

  /**
   * 获取下一个指定类型的节点 ID
   * @param nodeType 节点类型：'note' | 'image' | 'video'
   * @returns 新的节点 ID，如 'note-3', 'image-1' 等
   */
  getNextNodeId: (nodeType: NodeType) => {
    const current = get().nodeIdCounters[nodeType]
    const nextId = `${nodeType}-${current}`
    set((state) => ({
      nodeIdCounters: {
        ...state.nodeIdCounters,
        [nodeType]: current + 1,
      },
    }))
    return nextId
  },

  /**
   * 创建新节点（统一入口）
   */
  addNode: (nodeType: NodeType) => {
    const nextId = get().getNextNodeId(nodeType)
    const currentNodes = get().nodes
    const nextPosition = getNextNodePosition(currentNodes)
    let newNode: AllNodeType

    if (nodeType === 'note') {
      newNode = {
        id: nextId,
        type: 'noteNode',
        position: nextPosition,
        width: 280,
        height: 180,
        data: {
          content: '',
          inputHandleId: 'input',
          outputHandleId: 'output',
          isEditing: true,
          createdAt: Date.now(),
        },
      }
    } else if (nodeType === 'image') {
      newNode = {
        id: nextId,
        type: 'imageNode',
        position: nextPosition,
        width: 350,
        height: 250,
        data: {
          model: 'dall-e-3',
          prompt: '',
          status: GenerationStatus.COMPLETED,
          progress: 0,
          result: {
            type: 'image',
            data: [],
          },
          createdAt: Date.now(),
        },
      }
    } else {
      newNode = {
        id: nextId,
        type: 'videoNode',
        position: nextPosition,
        width: 400,
        height: 280,
        data: {
          model: 'genai-video',
          prompt: '',
          aspect_ratio: '16:9',
          status: GenerationStatus.COMPLETED,
          progress: 0,
          metadata: { size: '1280x720' },
          result: {
            type: 'video',
            data: [],
          },
          createdAt: Date.now(),
        },
      }
    }

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }))
  },

  /**
   * 更新便签节点编辑态
   */
  setNoteNodeEditing: (nodeId: string, isEditing: boolean) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId || node.type !== 'noteNode') {
          return node
        }

        return {
          ...node,
          data: {
            ...node.data,
            isEditing,
          },
        }
      }),
    }))
  },

  /**
   * 更新便签节点内容
   */
  updateNoteNodeContent: (nodeId: string, content: string) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId || node.type !== 'noteNode') {
          return node
        }

        return {
          ...node,
          data: {
            ...node.data,
            content,
          },
        }
      }),
    }))
  },

  /**
   * 调整节点尺寸
   * @param nodeId 节点 ID
   * @param width 新宽度
   * @param height 新高度
   */
  resizeNode: (nodeId: string, width: number, height: number) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) {
          return node
        }
        return { ...node, width, height }
      }),
    }))
  },

  /**
   * 复制节点
   * @param nodeId 要复制的节点 ID
   */
  duplicateNode: (nodeId: string) => {
    const currentNode = get().nodes.find((node) => node.id === nodeId)

    if (!currentNode) {
      return
    }

    // 识别节点类型
    let nodeType: NodeType = 'note'
    if (currentNode.type === 'imageNode') {
      nodeType = 'image'
    } else if (currentNode.type === 'videoNode') {
      nodeType = 'video'
    }

    const newId = get().getNextNodeId(nodeType)
    let duplicatedNode: AllNodeType

    if (currentNode.type === 'noteNode') {
      duplicatedNode = {
        ...currentNode,
        id: newId,
        position: {
          x: currentNode.position.x + 40,
          y: currentNode.position.y + 40,
        },
        data: {
          ...currentNode.data,
          isEditing: false,
          createdAt: Date.now(),
        },
      }
    } else {
      duplicatedNode = {
        ...currentNode,
        id: newId,
        position: {
          x: currentNode.position.x + 40,
          y: currentNode.position.y + 40,
        },
        data: {
          ...currentNode.data,
          createdAt: Date.now(),
        },
      }
    }

    set((state) => ({
      nodes: [...state.nodes, duplicatedNode],
    }))
  },

  /**
   * 删除节点及其关联的所有边
   * @param nodeId 要删除的节点 ID
   */
  deleteNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    }))
  },

  // ==================== 流程事件处理 ====================

  /**
   * 处理节点变化事件（位置、尺寸、删除等）
   */
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
  },

  /**
   * 处理边变化事件
   */
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },

  /**
   * 处理新连接创建事件
   */
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }))
  },
}))