import multer from "multer"
import { AppError } from "../utils/error/errorClasses"

// Configure memory storage
const memoryStorage = multer.memoryStorage()

// File filter function for documents
const documentFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError(400, 'Invalid file type. Only PDF and Word documents are allowed'))
  }
}

// File filter function for payment receipts
const paymentFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError(400, 'Invalid file type. Only PDF and image files (JPEG, PNG) are allowed'))
  }
}

// Configure multer options
const multerConfig = {
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
}

// Create multer instances
export const uploadSupportingDoc = multer({ ...multerConfig, fileFilter: documentFileFilter })
export const uploadDocument = multer({ ...multerConfig, fileFilter: documentFileFilter })
export const uploadTemplate = multer({ ...multerConfig, fileFilter: documentFileFilter })
export const uploadPayment = multer({ ...multerConfig, fileFilter: paymentFileFilter })
