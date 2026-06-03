import { sendError } from "../utils/apiResponse.js"

export const validateParams = (schema) => {
  return (request, response, next) => {
    const result = schema.safeParse(request.params)

    if (!result.success) {
      const isDevelopment = process.env.NODE_ENV === "development"

      const responseBody = {
        code: "VALIDATION_ERROR",
        message: "Invalid route parameters",
      }

      if (isDevelopment) {
        responseBody.errors = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      }

      return sendError(response, 400, responseBody)
    }

    request.validatedParams = result.data
    next()
  }
}
