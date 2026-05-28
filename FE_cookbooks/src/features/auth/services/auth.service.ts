import axios from 'axios'
import { API_BASE_URL } from '../../../config/env'

export type AuthUser = {
  id?: number
  username: string
  email: string
}

export type LoginResponse = {
  message: string
  user: AuthUser
}

export type RegisterResponse = {
  status: string
  user: AuthUser
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
  withCredentials: true,
})

export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await authApiClient.post<LoginResponse>('/auth/login', payload)

  return data
}

export async function registerService(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await authApiClient.post<RegisterResponse>('/auth/register', payload)

  return data
}

export async function logoutService(): Promise<void> {
  await authApiClient.post('/auth/logout')
}
