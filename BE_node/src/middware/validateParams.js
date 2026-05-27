export const validateParams = (schema) => {
  return (request, response, next) => {
    const result = schema.safeParse(request.params)

    if (!result.success) {
      const isDevelopment = process.env.NODE_ENV === "development"

      const responseBody = {
        message: "Invalid route parameters",
      }

      if (isDevelopment) {
        responseBody.errors = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      }

      return response.status(400).json(responseBody)
    }

    request.validatedParams = result.data
    next()
  }
}
