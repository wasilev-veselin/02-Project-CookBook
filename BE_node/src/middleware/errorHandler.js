import { randomUUID } from "node:crypto"
import { Prisma } from "@prisma/client"
import { AppError } from "../errors/AppError.js"
import { sendError } from "../utils/apiResponse.js"
import { logger } from "../utils/logger.js"

const getPositiveNumberFromEnv = (name, fallbackValue) => {
  const parsedValue = Number(process.env[name])

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue
}

const slowRequestThresholdMs = getPositiveNumberFromEnv("SLOW_REQUEST_THRESHOLD_MS", 1000)

// Adds a request id and logs when each request starts and finishes.
export function requestLogger(request, response, next) {
  const startedAt = Date.now()
  request.requestId = request.headers["x-request-id"] || randomUUID()

  logger.info("Request started", {
    requestId: request.requestId,
    event: "START",
    method: request.method,
    path: request.originalUrl,
  })

  response.on("finish", () => {
    const durationMs = Date.now() - startedAt

    // Runs only when Express has sent a response.
    logger.info("Request finished", {
      requestId: request.requestId,
      event: "FINISH",
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs,
    })

    if (durationMs >= slowRequestThresholdMs) {
      logger.warn("Slow request", {
        requestId: request.requestId,
        event: "SLOW_REQUEST",
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs,
        thresholdMs: slowRequestThresholdMs,
        userId: request.user?.id,
      })
    }
  })

  response.on("close", () => {
    // Helps detect aborted connections or handlers that never completed normally.
    if (!response.writableEnded) {
      logger.warn("Request closed before finish", {
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
        logger.error("Request timeout", {
          requestId: request.requestId,
          event: "REQUEST_TIMEOUT",
          method: request.method,
          path: request.originalUrl,
          timeoutMs,
        })

        sendError(response, 503, {
          code: "REQUEST_TIMEOUT",
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
  next(new AppError(404, "ROUTE_NOT_FOUND", `Route not found: ${request.method} ${request.originalUrl}`))
}

// Final Express error middleware. Keep this after all routes and fallback handlers.
export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof AppError) {
    logger.warn("Application error", {
      requestId: request.requestId,
      method: request.method,
      path: request.originalUrl,
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    })

    return sendError(response, error.statusCode, {
      code: error.code,
      message: error.message,
      requestId: request.requestId,
      details: error.details,
    })
  }

  // express.json() throws SyntaxError before route handlers run when JSON is malformed.
  if (error instanceof SyntaxError && "body" in error) {
    error.statusCode = 400
    error.apiCode = "INVALID_JSON_BODY"
    error.message = "Invalid JSON body"
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    error.statusCode = 400
    error.apiCode = "PRISMA_VALIDATION_ERROR"
    error.message = "Invalid data provided"
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field"
      error.statusCode = 400
      error.apiCode = "UNIQUE_CONSTRAINT_FAILED"
      error.message = `${field} already exists`
    }

    if (error.code === "P2003") {
      error.statusCode = 400
      error.apiCode = "INVALID_RELATION"
      error.message = "Invalid reference: related record does not exist"
    }

    if (error.code === "P2025") {
      error.statusCode = 404
      error.apiCode = "RECORD_NOT_FOUND"
      error.message = "Record not found"
    }
  }

  if (
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    error.statusCode = error.statusCode ?? 500
    error.apiCode = error.apiCode ?? "DATABASE_ERROR"
    error.publicMessage = error.apiCode === "DATABASE_ERROR" ? "Database error" : error.message
  }

  const statusCode = error.statusCode || error.status || 500
  const isDevelopment = process.env.NODE_ENV === "development"

  // Logs are for developers/operators; response details are limited below.
  logger.error("API error", {
    requestId: request.requestId,
    method: request.method,
    path: request.originalUrl,
    statusCode,
    message: error.message,
    stack: isDevelopment ? error.stack : undefined,
  })

  // In production, hide internal 500 details from the client.
  sendError(response, statusCode, {
    code: error.apiCode ?? (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : undefined),
    message: error.publicMessage ?? (statusCode === 500 && !isDevelopment ? "Internal server error" : error.message),
    requestId: request.requestId,
    ...(isDevelopment && {
      debug: {
        name: error.name,
        stack: error.stack,
      },
    }),
  })
}
