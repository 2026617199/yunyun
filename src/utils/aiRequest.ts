import axios, { AxiosRequestConfig } from 'axios'

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://toapisrrrrrrrr.com'

const aiService = axios.create({
  baseURL: AI_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer sk-8ngj8WD671ZFioHc2qypEJFQwhWeims435RtteF28IPxgHWR',
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