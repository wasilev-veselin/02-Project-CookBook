import { randomUUID } from "node:crypto"
import { Prisma } from "@prisma/client"
import { sendError } from "../utils/apiResponse.js"

// Adds a request id and logs when each request starts and finishes.
export function requestLogger(request, response, next) {
  const startedAt = Date.now()
  request.requestId = request.headers["x-request-id"] || randomUUID()

  console.log({
    requestId: request.requestId,
    event: "START",
    method: request.method,
    path: request.originalUrl,
  })

  response.on("finish", () => {
    // Runs only when Express has sent a response.
    console.log({
      requestId: request.requestId,
      event: "FINISH",
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
    })
  })

  response.on("close", () => {
    // Helps detect aborted connections or handlers that never completed normally.
    if (!response.writableEnded) {
      console.warn({
        requestId: request.requestId,
        event: "CLOSE_BEFORE_FINISH",
        method: request.method,
        path: request.originalUrl,
        durationMs: Date.now() - startedAt,
      })
    }
  })

  next()
}

// Prevents requests from hanging forever when a route forgets to send a response.
export function requestTimeout(timeoutMs = 15000) {
  return (request, response, next) => {
    response.setTimeout(timeoutMs, () => {
      if (!response.headersSent) {
        console.error({
          requestId: request.requestId,
          event: "REQUEST_TIMEOUT",
          method: request.method,
          path: request.originalUrl,
          timeoutMs,
        })

        sendError(response, 503, {
          message: "Request timeout",
          requestId: request.requestId,
        })
      }
    })

    next()
  }
}

// Converts unmatched routes into normal errors handled by errorHandler.
export function notFoundHandler(request, response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`)
  error.statusCode = 404
  next(error)
}

// Final Express error middleware. Keep this after all routes and fallback handlers.
export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  // express.json() throws SyntaxError before route handlers run when JSON is malformed.
  if (error instanceof SyntaxError && "body" in error) {
    error.statusCode = 400
    error.message = "Invalid JSON body"
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    error.statusCode = 400
    error.message = "Invalid data provided"
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field"
      error.statusCode = 400
      error.message = `${field} already exists`
    }

    if (error.code === "P2003") {
      error.statusCode = 400
      error.message = "Invalid reference: related record does not exist"
    }

    if (error.code === "P2025") {
      error.statusCode = 404
      error.message = "Record not found"
    }
  }

  const statusCode = error.statusCode || error.status || 500
  const isDevelopment = process.env.NODE_ENV === "development"

  // Logs are for developers/operators; response details are limited below.
  console.error({
    requestId: request.requestId,
    method: request.method,
    path: request.originalUrl,
    statusCode,
    message: error.message,
    stack: isDevelopment ? error.stack : undefined,
  })

  // In production, hide internal 500 details from the client.
  sendError(response, statusCode, {
    message: statusCode === 500 && !isDevelopment ? "Internal server error" : error.message,
    requestId: request.requestId,
    ...(isDevelopment && {
      debug: {
        name: error.name,
        stack: error.stack,
      },
    }),
  })
}
