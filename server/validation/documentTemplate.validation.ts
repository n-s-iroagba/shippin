import { AppError } from '../utils/error/errorClasses';

interface DocumentTemplateData {
  name: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateDocumentTemplateCreation = (data: DocumentTemplateData): void => {
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    throw new AppError(400, 'Name is required and must be a non-empty string');
  }

  if (!data.filePath || typeof data.filePath !== 'string') {
    throw new AppError(400, 'File path is required');
  }

  if (!data.fileType || !ALLOWED_FILE_TYPES.includes(data.fileType)) {
    throw new AppError(400, 'Invalid file type. Only PDF and Word documents are allowed');
  }

  if (typeof data.fileSize !== 'number' || data.fileSize <= 0 || data.fileSize > MAX_FILE_SIZE) {
    throw new AppError(400, `File size must be between 0 and ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
};

export const validateDocumentTemplateUpdate = (data: Partial<DocumentTemplateData>): void => {
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || !data.name.trim()) {
      throw new AppError(400, 'Name must be a non-empty string');
    }
  }

  if (data.filePath !== undefined && typeof data.filePath !== 'string') {
    throw new AppError(400, 'File path must be a string');
  }

  if (data.fileType !== undefined && !ALLOWED_FILE_TYPES.includes(data.fileType)) {
    throw new AppError(400, 'Invalid file type. Only PDF and Word documents are allowed');
  }

  if (data.fileSize !== undefined && (typeof data.fileSize !== 'number' || data.fileSize <= 0 || data.fileSize > MAX_FILE_SIZE)) {
    throw new AppError(400, `File size must be between 0 and ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
}; 