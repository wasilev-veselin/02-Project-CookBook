//
// middlewares - Custom Express middleware such as validation, error handling, and CORS.

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Invalid JSON body" })
  }

  console.error({
    requestId: request.requestId,
    method: request.method,
    path: request.path,
    error,
  })

  response.status(500).json({ error: "Internal server error" })
}
