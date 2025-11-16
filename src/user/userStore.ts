import { create } from 'zustand'
import type { SearchUserInterface, UserState } from './interface'
import * as actions from './actions'

const useUserStore = create<UserState>((set) => ({
  isError: false,
  isLoading: false,
  users: [],

  getAllUsers: async (param: SearchUserInterface) => {
    set({ isError: false, isLoading: false, users: [] })
    try {
      const res = await actions.getAllUsers(param)
      if (res.status === 200) {
        set({ users: res.data })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useUserStore
