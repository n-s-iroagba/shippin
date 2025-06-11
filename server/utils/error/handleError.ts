import { Response } from "express"
import {
  DatabaseError,
  ForeignKeyConstraintError,
} from "sequelize"
import { AppError,  ValidationError} from "./AppError"
import ApiResponse from "../../type/ApiResponse"
import logger from "../logger"

export const handleError = (
  error: any,
  context:string,
  res?: Response
): void => {
  logger.error(`[${context}] ${error?.message || error}`)

  let statusCode = 500
  let message = "An unexpected error occurred"
  let errors: string[] | undefined = undefined

  if (error instanceof AppError) {
    statusCode = error.code
    message = error.message
   
  } else if (error instanceof ValidationError) {
    statusCode = 400
    message = "Validation error"
    errors = error.errors.map((e) => e.message)
  } else if (error instanceof ForeignKeyConstraintError) {
    statusCode = 400
    message = "Foreign key constraint error"
  } else if (error instanceof DatabaseError) {
    statusCode = 500
    message = "Database error"
  }

  const response: ApiResponse<any> = {
    success: false,
    message,
    data:errors,
  }

  // Only send response if res object is available
  if (res) {
    res.status(statusCode).json(response)
  }
}
