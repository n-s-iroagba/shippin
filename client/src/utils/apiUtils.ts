import { SERVER_URL } from "@/data/urls";


interface ApiResponse<T> {
  data: T;
}

// Auth API calls
export const authApi = {
  signup: async (data: { name: string; email: string; password: string }): Promise<{ verificationToken: string }> => {
    try {
      const response = await fetch(`${SERVER_URL}/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  verifyEmail: async (data: { code: string; verificationToken: string }): Promise<{ loginToken: string }> => {
    try {
      const response = await fetch(`${SERVER_URL}/admin/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  login: async (data: { email: string; password: string }): Promise<ApiResponse<{ loginToken?: string, verificationToken?: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  resendVerification: async (data: { verificationToken: string }): Promise<ApiResponse<{ verificationToken: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/resend-verification-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  validateResetToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/validate-reset-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: token }),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  resetPassword: async (data: { password: string; resetToken: string }): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
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
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  post: async <U, T>(endpoint: string, data: U): Promise<T> => {
    console.log(`${SERVER_URL}${endpoint}`)
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {

        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  patch: async <U, T>(endpoint: string, data: U): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },
};

export const ApiUtis = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
         headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  post: async <U, T>(endpoint: string, data: U): Promise<T> => {
    console.log(`${SERVER_URL}${endpoint}`)
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {

        method: 'POST',
         headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  patch: async <U, T>(endpoint: string, data: U): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'DELETE',
         headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();

    } catch (error) {
      console.error(error)
      throw error
    }
  },
};