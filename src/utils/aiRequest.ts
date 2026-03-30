import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

// 从 utils 导入 API 密钥管理函数
import { getAiToken, getZeakaiToken } from './utils'

// ===================== 服务基础配置 =====================

// 全局请求超时时间（单位：毫秒）
const REQUEST_TIMEOUT = 300000

// 通用请求头配置
const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

// 服务配置类型
type ServiceConfig = {
  baseURL: string
  getToken: () => string
}

/**
 * 检测是否在 Electron 环境中运行
 */
const isElectron = (): boolean => {
  // 检测 window.electron（preload 脚本注入）
  if (typeof window !== 'undefined' && (window as any).electron) {
    return true
  }
  // 检测 user agent
  if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')) {
    return true
  }
  return false
}

/**
 * 获取基础 URL
 * - Electron 环境：使用完整的 API 地址
 * - Web 环境：使用相对路径（由 Vite 代理或 Nginx 代理处理）
 */
const getBaseURL = (apiPath: string): string => {
  if (isElectron()) {
    // Electron 环境直接请求 API 服务器
    const apiServers: Record<string, string> = {
      ai: 'https://toapis.com',
      zeakai: 'https://zeakai-api.api4midjourney.com',
    }
    return apiServers[apiPath] || '/'
  }
  // Web 环境使用相对路径，由代理处理
  return '/'
}

// 服务配置映射
const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  ai: {
    baseURL: getBaseURL('ai'), // Electron: https://toapis.com, Web: /
    getToken: getAiToken,
  },
  zeakai: {
    baseURL: getBaseURL('zeakai'), // Electron: https://zeakai-api.api4midjourney.com, Web: /
    getToken: getZeakaiToken,
  },
}

// ===================== 工厂函数：创建服务实例 =====================

/**
 * 创建 axios 服务实例
 * @param serviceName 服务名称
 * @param config 服务配置
 */
const createService = (serviceName: string, config: ServiceConfig): AxiosInstance => {
  const service = axios.create({
    baseURL: config.baseURL,
    headers: { ...DEFAULT_HEADERS },
    timeout: REQUEST_TIMEOUT,
  })

  // 请求拦截器 - 动态设置 Authorization
  service.interceptors.request.use(
    (reqConfig) => {
      const token = config.getToken()
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`
      }
      return reqConfig
    },
    (error) => Promise.reject(error)
  )

  // 响应拦截器 - 直接返回 response.data
  service.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
  )

  return service
}

// ===================== 创建服务实例 =====================

const aiService = createService('ai', SERVICE_CONFIGS.ai)
const zeakaiService = createService('zeakai', SERVICE_CONFIGS.zeakai)

// ===================== 请求方法封装 =====================

/**
 * AI 服务请求方法
 */
const aiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return await aiService.request(config)
}

/**
 * ZeakAI 服务请求方法
 */
const zeakaiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return await zeakaiService.request(config)
}

// ===================== 导出 =====================

export { aiService, zeakaiService }
export default aiRequest
export { zeakaiRequest, getBaseURL as getAIBaseURL }
