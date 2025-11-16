import {
  type LoginInterface,
  type RegisterInterface,
  type SearchUserInterface,
} from './interface'
import { get, post } from '@/utility/request'

export const login = (data: LoginInterface) =>
  post('/user/login', JSON.stringify(data))

export const register = (data: RegisterInterface) =>
  post('/user/register', JSON.stringify(data))

export const getAllUsers = (param: SearchUserInterface) => get('/user', param)
