
import { SERVER_URL } from '../data/urls';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth API calls
export const authApi = {
  signup: async (data: { name: string; email: string; password: string }): Promise<ApiResponse<{ verificationToken: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  verifyEmail: async (data: { code: string; verificationToken: string }): Promise<ApiResponse<{ loginToken: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  login: async (data: { email: string; password: string }): Promise<ApiResponse<{ loginToken: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  verifyEmail: async (data: { code: string; verificationToken: string }): Promise<ApiResponse<{ loginToken: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  resendVerification: async (data: { verificationToken: string }): Promise<ApiResponse<{ verificationToken: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/resend-verification-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  validateResetToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/validate-reset-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: token }),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  resetPassword: async (data: { password: string; resetToken: string }): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },
};

// Protected API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const protectedApi = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      return response.ok ? { data: result } : { error: result.message };
    } catch (error) {
      return { error: 'An error occurred. Please try again later.' };
    }
  },
};
