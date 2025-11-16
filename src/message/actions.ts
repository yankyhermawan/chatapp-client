import { get } from '@/utility/request'
import type { GetAllMessageParams } from './interface'

export const getAllMessage = (params: GetAllMessageParams) =>
  get('/message/all', params)
