import type { AxiosRequestConfig } from 'axios'
import type { z } from 'zod'
import { ApiContractError } from '../../types/api'
import { apiClient } from './apiClient'

export function parseApiData<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new ApiContractError('Invalid API response data.')
  }

  return result.data
}

export async function requestApiData<TSchema extends z.ZodType>(
  url: string,
  schema: TSchema,
  config?: AxiosRequestConfig,
): Promise<z.infer<TSchema>> {
  const { data } = await apiClient.get<unknown>(url, config)

  return parseApiData(schema, data)
}
