import { z } from 'zod'
import { apiClient } from '../../../shared/api/apiClient'
import { parseApiData } from '../../../shared/api/parseApiData'

const authUserSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  email: z.string(),
})

const loginResponseSchema = z.object({
  message: z.string(),
  user: authUserSchema,
})

const registerResponseSchema = z.object({
  status: z.string(),
  user: authUserSchema,
})

export type AuthUser = z.infer<typeof authUserSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
}

export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<unknown>('/auth/login', payload)

  return parseApiData(loginResponseSchema, data)
}

export async function registerService(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<unknown>('/auth/register', payload)

  return parseApiData(registerResponseSchema, data)
}

export async function logoutService(): Promise<void> {
  await apiClient.post('/auth/logout')
}
