import axios, { AxiosRequestConfig } from 'axios'

const aiService = axios.create({
  // 同源代理前缀：由 vite proxy 转发到真实 AI 服务并注入 Authorization
  baseURL: '/ai-proxy',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 300000,
})

// 请求拦截器
aiService.interceptors.request.use(
  // (config) => {
  //   config.headers.Authorization = `Bearer ${AI_TOKEN}`
  //   return config
  // },
  // (error) => {
  //   return Promise.reject(error)
  // }
)

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