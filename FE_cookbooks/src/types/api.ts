export type ApiError = {
  code: string
  message: string
  details?: unknown
  requestId?: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export type ApiSuccess<TData> = {
  success: true
  data: TData
  error: null
}

export type ApiFailure = {
  success: false
  data: null
  error: ApiError
}

export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure

export class ApiClientError extends Error {
  code: string
  details?: unknown
  requestId?: string
  fieldErrors?: ApiError['errors']

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiClientError'
    this.code = error.code
    this.details = error.details
    this.requestId = error.requestId
    this.fieldErrors = error.errors
  }
}

export class ApiContractError extends Error {
  constructor(message = 'Unexpected API response shape.') {
    super(message)
    this.name = 'ApiContractError'
  }
}
