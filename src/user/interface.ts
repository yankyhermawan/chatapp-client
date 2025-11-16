export interface LoginInterface {
  username: string
  password: string
}

export interface RegisterInterface {
  username: string
  name: string
  password: string
}

export interface Auth {
  userId: string
  token: string
}

export interface SearchUserInterface {
  search?: string
  id?: number
}

export interface AuthState {
  auth: Partial<Auth>
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  myData: Partial<User>
  login: (data: LoginInterface) => void
  register: (data: RegisterInterface) => void
  getMyData: (id: number) => void
  initializeToken: () => void
}

export interface User {
  id: number
  name: string
  username: string
}

export interface UserState {
  users: User[]
  isError: boolean
  isLoading: boolean
  getAllUsers: (param: SearchUserInterface) => void
}
