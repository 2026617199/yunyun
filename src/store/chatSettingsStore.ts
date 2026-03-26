import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_CANVAS_CHAT_MODEL } from '@/constants/ai-models'
import type { ChatPersonaId } from '@/types/NoteGeneration'

type ChatSettingsState = {
  /** 默认对话模型 */
  defaultModel: string
  /** 默认人设 ID */
  defaultPersonaId: ChatPersonaId
}

type ChatSettingsActions = {
  setDefaultModel: (model: string) => void
  setDefaultPersonaId: (personaId: ChatPersonaId) => void
  resetToDefault: () => void
}

const INITIAL_STATE: ChatSettingsState = {
  defaultModel: DEFAULT_CANVAS_CHAT_MODEL,
  defaultPersonaId: 'none',
}

export const useChatSettingsStore = create<ChatSettingsState & ChatSettingsActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setDefaultModel: (model) => set({ defaultModel: model }),
      setDefaultPersonaId: (personaId) => set({ defaultPersonaId: personaId }),
      resetToDefault: () => set(INITIAL_STATE),
    }),
    {
      name: 'canvas-chat-settings',
    },
  ),
)
