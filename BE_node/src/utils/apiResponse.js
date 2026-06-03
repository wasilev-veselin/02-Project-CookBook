const defaultErrorCodeByStatus = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  500: "INTERNAL_SERVER_ERROR",
  503: "SERVICE_UNAVAILABLE",
}

const normalizeError = (statusCode, error) => ({
  ...error,
  code: error.code ?? defaultErrorCodeByStatus[statusCode] ?? "API_ERROR",
  message: error.message ?? "Request failed",
})

export const sendSuccess = (response, statusCode, data = null) =>
  response.status(statusCode).json({
    success: true,
    data,
    error: null,
  })

export const sendError = (response, statusCode, error) =>
  response.status(statusCode).json({
    success: false,
    data: null,
    error: normalizeError(statusCode, error),
  })
