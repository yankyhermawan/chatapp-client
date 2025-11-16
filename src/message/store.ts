import { create } from 'zustand'
import type { GetAllMessageParams, MessageState } from './interface'
import * as actions from './actions'

const useMessageStore = create<MessageState>((set) => ({
  isLoading: false,
  isError: false,
  messages: [],

  getAllMessages: async (params: GetAllMessageParams) => {
    set({ isLoading: false, isError: false, messages: [] })
    try {
      const res = await actions.getAllMessage(params)
      if (res.status === 200) {
        set({ messages: res.data })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useMessageStore
