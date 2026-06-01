import axios from 'axios'
import { API_BASE_URL } from '../../config/env'
import { ApiClientError, ApiContractError, type ApiError } from '../../types/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function normalizeApiError(error: unknown): ApiError {
  if (isRecord(error) && typeof error.message === 'string') {
    return {
      code: typeof error.code === 'string' ? error.code : 'SERVER_ERROR',
      message: error.message,
      details: error.details,
      requestId: typeof error.requestId === 'string' ? error.requestId : undefined,
      errors: Array.isArray(error.errors)
        ? error.errors.filter(
            (fieldError): fieldError is { field: string; message: string } =>
              isRecord(fieldError) &&
              typeof fieldError.field === 'string' &&
              typeof fieldError.message === 'string',
          )
        : undefined,
    }
  }

  return {
    code: 'SERVER_ERROR',
    message: 'Server request failed.',
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => {
    const apiResponse = response.data

    if (!isRecord(apiResponse) || typeof apiResponse.success !== 'boolean') {
      throw new ApiContractError()
    }

    if (!apiResponse.success) {
      throw new ApiClientError(normalizeApiError(apiResponse.error))
    }

    response.data = apiResponse.data

    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      throw new ApiClientError({
        code: 'NETWORK_ERROR',
        message: error.response ? 'Server request failed.' : 'Could not connect to the server.',
        details: error.response?.data,
      })
    }

    throw error
  },
)
