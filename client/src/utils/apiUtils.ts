
const SERVER_URL =process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export const protectedApi = {
  get: async <T>(endpoint: string): Promise<T> => {
    console.log('Making GET request to:', `${SERVER_URL}${endpoint}`);
    
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      console.log('Response not ok, status:', response.status);
      let errorMessage = "Request failed";
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        console.log('Failed to parse error JSON:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Response is not JSON, content-type:', contentType);
      const text = await response.text();
      console.log('Response text:', text);
      return text as T;
    }
    
    const result = await response.json();
    console.log('Parsed result:', result);
    console.log('Result type:', typeof result);
    console.log('Result is array:', Array.isArray(result));
    
    return result;
  },

  post: async <T, U>(endpoint: string, data: U): Promise<T> => {
    console.log('Making POST request to:', `${SERVER_URL}${endpoint}`);
    
    const isFormData = data instanceof FormData;
    const headers = isFormData 
      ? { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }
      : getAuthHeaders();
    
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = "Request failed";
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        console.log('Failed to parse error JSON:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  },

  patch: async <T, U>(endpoint: string, data: U): Promise<T> => {
    console.log('Making PATCH request to:', `${SERVER_URL}${endpoint}`);
      const isFormData = data instanceof FormData;
    const headers = isFormData 
      ? { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }
      : getAuthHeaders();
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "PATCH",
     headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = "Request failed";
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        console.log('Failed to parse error JSON:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    console.log('Making DELETE request to:', `${SERVER_URL}${endpoint}`);
    
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = "Request failed";
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        console.log('Failed to parse error JSON:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  },

}
// Public API calls
export const publicApi = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
    });
if (!response.ok) throw new Error("Request failed")
return await response.json();
},

}
