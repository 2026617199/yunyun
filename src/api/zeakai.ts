import { zeakaiRequest } from '@/utils/zeakaiService'
import type { submitMjImagineResponse, fetchMjTaskResponse } from '@/types/MJGeneration'

// 提交 Midjourney imagine 任务
export function submitMjImagine(data: { prompt: string }) {
  return zeakaiRequest({
    url: '/mj/submit/imagine',
    method: 'post',
    data
  })
}

// 获取 Midjourney 任务状态
export function fetchMjTask(id: string) {
  return zeakaiRequest({
    url: `/mj/task/${id}/fetch`,
    method: 'get'
  })
}
 