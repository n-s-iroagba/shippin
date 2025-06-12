import { Response } from "express"
import {
  DatabaseError,
  ForeignKeyConstraintError,
} from "sequelize"
import { AppError, ValidationError } from "./errorClasses"
import ApiResponse from "../../dto/ApiResponse"
import logger from "../logger"

export const handleError = (
  error: any,
  context:string,
  res?: Response
): void => {
  logger.error(`Error in ${context}:`, {
    error: error.message,
    stack: error.stack,
    context
  })

  if (error instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      message: error.message
    }
    res?.status(error.code).json(response)
    return
  }

  if (error instanceof ValidationError) {
    const response: ApiResponse<null> = {
      success: false,
      message: error.message,
      errors: error.errors
    }
    res?.status(400).json(response)
    return
  }

  // Handle Sequelize validation errors
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const response: ApiResponse<null> = {
    success: false,
      message: 'Validation error',
      errors: error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    }
    res?.status(400).json(response)
    return
  }

  // Handle any other errors
  const response: ApiResponse<null> = {
    success: false,
    message: 'Internal server error'
  }
  res?.status(500).json(response)
}
