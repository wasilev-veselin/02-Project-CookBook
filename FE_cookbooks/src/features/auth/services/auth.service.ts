import axios from 'axios'
import { API_BASE_URL } from '../../../config/env'

export type LoginResponse = {
  message: string
}

export type RegisterResponse = {
  status: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
}

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
})

export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await authApiClient.post<LoginResponse>('/auth/login', payload)

  return data
}

export async function registerService(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await authApiClient.post<RegisterResponse>('/auth/register', payload)

  return data
}
