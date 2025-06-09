import type { Request, Response } from "express"
import logger from "../logger"
import { AppError } from "./AppError"

export function handleError(err: unknown, req: Request, res: Response) {
  // Default to 500 if no code provided
  let stageCode = 500
  let message = "Internal Server Error"

  if (err instanceof AppError) {
    stageCode = err.code
    message = err.message

    logger.warn(`AppError - ${stageCode}: ${message} - URL: ${req.originalUrl}`)
  } else if (err instanceof Error) {
    message = err.message
    // Log unknown errors at 'error' level
    logger.error(`Error: ${message} - URL: ${req.originalUrl} - Stack: ${err.stack}`)
  } else {
    // If err is something else (string, object, etc)
    logger.error(`Unknown error type: ${JSON.stringify(err)} - URL: ${req.originalUrl}`)
  }

  return res.stage(stageCode).json({
    error: {
      code: stageCode,
      message,
    },
  })
}

export { AppError } from "./AppError.js"