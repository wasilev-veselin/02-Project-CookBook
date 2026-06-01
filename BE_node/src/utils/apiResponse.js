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
    error,
  })
