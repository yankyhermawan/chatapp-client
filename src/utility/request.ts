import { endpoint } from '../common/constant'
import { notification } from '@/components/notification/Notification'
import qs from 'qs'

const token = localStorage.getItem('token')

const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

class ErrorResponse {
  status: number
  errorMessage: string
  constructor(resStatus: number, resMessage: string) {
    this.status = resStatus
    this.errorMessage = resMessage
  }
}

const handleErrorResponse = (err: ErrorResponse) => {
  notification(err)
  if (err.status === 401 && window.location.pathname !== 'login') {
    handleLogout()
  }
}

export const get = async (prefix: string, data?: object) => {
  try {
    const queryString = qs.stringify(data)
    const res = await fetch(`${endpoint}${prefix}?${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const jsonData = await res.json()
    if ([4, 5].includes(Number(res.status.toString()[0]))) {
      throw new ErrorResponse(res.status, jsonData.errorMessage)
    }
    notification({ status: res.status, ...jsonData })
    return {
      status: res.status,
      data: jsonData.data,
    }
  } catch (err) {
    if (err instanceof ErrorResponse) {
      handleErrorResponse(err)
    }
    return {
      status: 500,
      data: err,
    }
  }
}

export const post = async (prefix: string, data: string) => {
  try {
    const res = await fetch(`${endpoint}${prefix}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: data,
    })
    const jsonData = await res.json()
    if ([4, 5].includes(Number(res.status.toString()[0]))) {
      throw new ErrorResponse(res.status, jsonData.errorMessage)
    }
    notification({ status: res.status, ...jsonData })

    return {
      status: res.status,
      data: jsonData.data,
    }
  } catch (err) {
    if (err instanceof ErrorResponse) {
      handleErrorResponse(err)
    }
    return {
      status: 500,
      data: err,
    }
  }
}

export const update = async (prefix: string, data: string) => {
  try {
    const res = await fetch(`${endpoint}${prefix}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: data,
    })
    const jsonData = await res.json()
    if ([4, 5].includes(Number(res.status.toString()[0]))) {
      throw new ErrorResponse(res.status, jsonData.errorMessage)
    }
    notification({ status: res.status, ...jsonData })

    return {
      status: res.status,
      data: jsonData.data,
    }
  } catch (err) {
    if (err instanceof ErrorResponse) {
      handleErrorResponse(err)
    }
    return {
      status: 500,
      data: err,
    }
  }
}
