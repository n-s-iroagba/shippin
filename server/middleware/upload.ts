
import multer from 'multer';
import path from 'path';
import fs from 'fs'

// Configure storage for different types of uploads
const storage = {
  templates: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = './uploads/templates';
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `template-${uniqueSuffix}-${file.originalname}`);
    }
  }),
  
  documents: multer.diskStorage({
    destination: './uploads/documents',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  }),

  supportingDocs: multer.diskStorage({
    destination: './uploads/supporting-docs',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  }),

  payments: multer.diskStorage({
    destination: './uploads/payments',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  })
};

// Create multer instances
export const uploadTemplate = multer({ storage: storage.templates });
export const uploadDocument = multer({ storage: storage.documents });
export const uploadPayment = multer({ storage: storage.payments });
