import { ValidationErrorItem } from '../utils/error/errorClasses';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationErrorItem[];
     pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default ApiResponse;