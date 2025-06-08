import multer from "multer"

// Use memory storage for all uploads
const memoryStorage = multer.memoryStorage()
export const uploadSupportingDoc = multer({ storage: memoryStorage })
export const uploadDocument = multer({ storage: memoryStorage })
export const uploadTemplate = multer({ storage: memoryStorage })
export const uploadPayment = multer({ storage: memoryStorage })
