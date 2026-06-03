const writeLog = (level, message, context = {}) => {
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  }

  if (level === "error") {
    console.error(logEntry)
    return
  }

  if (level === "warn") {
    console.warn(logEntry)
    return
  }

  console.log(logEntry)
}

export const logger = {
  info: (message, context) => writeLog("info", message, context),
  warn: (message, context) => writeLog("warn", message, context),
  error: (message, context) => writeLog("error", message, context),
  debug: (message, context) => {
    if (process.env.NODE_ENV === "development") {
      writeLog("debug", message, context)
    }
  },
}
