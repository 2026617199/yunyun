import axios, { AxiosRequestConfig } from 'axios'

// ZeakAI 服务基础地址
const ZEAKAI_BASE_URL = import.meta.env.VITE_ZEAKAI_BASE_URL || ''

// ZeakAI 服务密钥
const ZEAKAI_TOKEN = import.meta.env.VITE_ZEAKAI_TOKEN || ''

// 全局请求超时时间
const REQUEST_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 300000

// 创建 ZeakAI 服务实例
const zeakaiService = axios.create({
  baseURL: ZEAKAI_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ZEAKAI_TOKEN}`,
  },
  timeout: REQUEST_TIMEOUT,
})

// 响应拦截器
zeakaiService.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 请求方法封装
const zeakaiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return await zeakaiService.request(config)
}

export { zeakaiService, zeakaiRequest }
export default zeakaiRequest