import { create } from 'zustand'
import type { AuthState, LoginInterface, RegisterInterface } from './interface'
import { getAllUsers, login, register } from './actions'

const useAuthStore = create<AuthState>((set) => ({
  auth: {},
  myData: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  login: async (loginData: LoginInterface) => {
    set({ isLoading: true, isError: false, isSuccess: false })
    try {
      const res = await login(loginData)
      const { userId, token } = res.data
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
      if (userId) {
        localStorage.setItem('userId', userId)
      } else {
        localStorage.removeItem('userId')
      }
      set({ auth: res.data, isSuccess: true })
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
  register: async (registerData: RegisterInterface) => {
    set({ isLoading: true, isError: false, isSuccess: false })
    try {
      const res = await register(registerData)
      const { status } = res
      if (status === 201) {
        set({ isSuccess: true })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
  getMyData: async (id: number) => {
    set({ isLoading: true, isError: false, myData: {} })
    try {
      const res = await getAllUsers({ id })
      if (res.status === 200) {
        set({ myData: res.data[0] })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
  initializeToken: () => {
    const token = localStorage.getItem('token') || ''
    const userId = localStorage.getItem('userId') || ''
    set({ auth: { token, userId } })
  },
}))

export default useAuthStore
