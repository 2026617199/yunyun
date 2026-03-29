import { uploadImage } from "@/api/ai"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===================== localStorage API 密钥管理 =====================

// localStorage 中存储 API 密钥的键名
const AI_TOKEN_KEY = 'yunyun_ai_token'
const ZEAKAI_TOKEN_KEY = 'yunyun_zeakai_token'

/**
 * 获取 AI 服务密钥
 * 优先从 localStorage 获取，如果没有则返回空字符串
 */
export function getAiToken(): string {
  return localStorage.getItem(AI_TOKEN_KEY) || ''
}

/**
 * 设置 AI 服务密钥
 */
export function setAiToken(token: string): void {
  localStorage.setItem(AI_TOKEN_KEY, token)
}

/**
 * 获取 ZeakAI 服务密钥
 * 优先从 localStorage 获取，如果没有则返回空字符串
 */
export function getZeakaiToken(): string {
  return localStorage.getItem(ZEAKAI_TOKEN_KEY) || ''
}

/**
 * 设置 ZeakAI 服务密钥
 */
export function setZeakaiToken(token: string): void {
  localStorage.setItem(ZEAKAI_TOKEN_KEY, token)
}

/**
 * 检查是否已配置 API 密钥
 */
export function hasAiToken(): boolean {
  return !!getAiToken()
}

export function hasZeakaiToken(): boolean {
  return !!getZeakaiToken()
}


/**
 * 上传图片并获取 URL
 */
export async function uploadImageFile(file: File): Promise<string | undefined> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await uploadImage(formData)
    return response.data.url
  } catch (error) {
    console.error('上传图片失败:', error)
    return undefined
  }
}
