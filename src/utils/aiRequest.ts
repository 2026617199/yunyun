import axios, { AxiosRequestConfig } from 'axios'

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://toapis.com'
const AI_TOKEN = import.meta.env.VITE_AI_TOKEN || ''

const aiService = axios.create({
  baseURL: AI_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(AI_TOKEN ? { Authorization: `Bearer ${AI_TOKEN}` } : {}),
  },
  timeout: 300000,
})

// 响应拦截器
aiService.interceptors.response.use(
  (response) => {
    // 没有多余data
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

const aiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return await aiService.request(config)
}

export default aiRequest