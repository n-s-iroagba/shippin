import { AppError } from '../utils/error/errorClasses';

interface AdminRegistrationData {
  email: string;
  password: string;
  name: string;
}

interface AdminLoginData {
  email: string;
  password: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateAdminRegistration = (data: AdminRegistrationData): void => {
  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    throw new AppError(400, 'Valid email is required');
  }

  if (!data.password || typeof data.password !== 'string' || !validatePassword(data.password)) {
    throw new AppError(400, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
  }

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    throw new AppError(400, 'Name is required and must be a non-empty string');
  }
};

export const validateAdminLogin = (data: AdminLoginData): void => {
  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    throw new AppError(400, 'Valid email is required');
  }

  if (!data.password || typeof data.password !== 'string') {
    throw new AppError(400, 'Password is required');
  }
}; 