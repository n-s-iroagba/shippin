import { SocialMediaCreationDto } from "../dto/creationDtos";
import { SocialMedia } from "../models/SocialMedia";
import { ValidationError, ValidationErrorItem } from "../utils/error/errorClasses";
import { AppError } from '../utils/error/errorClasses';

// Fixed validation functions
const validateUpdateSocialMediaData = (data: Partial<SocialMedia>): void => {
  const errors: ValidationErrorItem[] = [] // Fixed: should be ValidationError[], not ValidationErrorItem[]

  if (data.name !== undefined && !data.name?.trim()) {
    errors.push({
      field: "name",
      message: "Social media name cannot be empty",
      value: data.name
    })
  }

  if (data.url !== undefined) {
    if (!data.url?.trim()) {
      errors.push({
        field: "url",
        message: "URL cannot be empty",
        value: data.url
      })
    } else {
      // Basic URL validation
      const urlRegex = /^https?:\/\/.+/i;
      if (!urlRegex.test(data.url)) {
        errors.push({
          field: "url",
          message: "Valid URL is required (must start with http:// or https://)",
          value: data.url
        })
      }
    }
  }


  if (errors.length) {
  
    throw new ValidationError( errors,'Update social media validation error occurred')
  }
}

const validateCreateSocialMediaData = (data: SocialMediaCreationDto): void => {
  const errors: ValidationErrorItem[] = [] 
  if (!data.name?.trim()) {
    errors.push({
      field: "name",
      message: "Social media name is required",
      value: data.name
    })
  }

  if (!data.url?.trim()) {
    errors.push({
      field: "url",
      message: "URL is required",
      value: data.url
    })
  } else {
    // Basic URL validation
    const urlRegex = /^https?:\/\/.+/i;
    if (!urlRegex.test(data.url)) {
      errors.push({
        field: "url",
        message: "Valid URL is required (must start with http:// or https://)",
        value: data.url
      })
    }
  }



  // Logo validation for creation (optional field)
  if (data.logo !== undefined && data.logo !== null) {
    if (typeof data.logo === 'string') {
      // If it's a base64 string, validate format
      const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
      if (!base64Regex.test(data.logo)) {
        errors.push({
          field: "logo",
          message: "Logo must be a valid base64 image string (jpeg, jpg, png, gif, or webp)",
          value: "base64 string"
        })
      }
    } else if (!Buffer.isBuffer(data.logo)) {
      errors.push({
        field: "logo",
        message: "Logo must be a valid image buffer or base64 string",
        value: typeof data.logo
      })
    }
  }

  if (errors.length) {

    throw new ValidationError(errors,'Create social media validation error occurred')
  }
}

interface SocialMediaData {
  name: string;
  url: string;
}

export const validateSocialMediaCreation = (data: SocialMediaData): void => {
  if (!data.name || typeof data.name !== 'string') {
    throw new AppError(400, 'Name is required and must be a string');
  }

  if (!data.url || typeof data.url !== 'string') {
    throw new AppError(400, 'URL is required and must be a string');
  }

  // Basic URL validation
  try {
    new URL(data.url);
  } catch (error) {
    throw new AppError(400, 'Invalid URL format');
  }
};

export const validateSocialMediaUpdate = (data: Partial<SocialMediaData>): void => {
  if (data.name !== undefined && typeof data.name !== 'string') {
    throw new AppError(400, 'Name must be a string');
  }

  if (data.url !== undefined) {
    if (typeof data.url !== 'string') {
      throw new AppError(400, 'URL must be a string');
    }
    // Basic URL validation
    try {
      new URL(data.url);
    } catch (error) {
      throw new AppError(400, 'Invalid URL format');
    }
  }
};

export { 
  validateUpdateSocialMediaData, 
  validateCreateSocialMediaData,
};