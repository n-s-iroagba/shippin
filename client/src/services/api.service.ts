import { ShipmentDetails, ShipmentStatus } from '../types/shipment.types';

export class ApiService {
  static async listDocumentTemplates() {
    return this.get('/api/admin/templates');
  }

  static async createDocumentTemplate(formData: FormData) {
    return this.post('/api/admin/templates', formData, true);
  }

  static async updateDocumentTemplate(id: number, formData: FormData) {
    return this.put(`/api/admin/templates/${id}`, formData, true);
  }

  static async deleteDocumentTemplate(id: number) {
    return this.delete(`/api/admin/templates/${id}`);
  }
  async listCryptoWallets() {
    const response = await fetch('/api/admin/crypto-wallets', {
      headers: await getAuthHeaders()
    });
    return handleResponse(response);
  },

  async createCryptoWallet(data: CreateCryptoWalletDto) {
    const response = await fetch('/api/admin/crypto-wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders())
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async updateCryptoWallet(id: number, data: UpdateCryptoWalletDto) {
    const response = await fetch(`/api/admin/crypto-wallets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders())
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteCryptoWallet(id: number) {
    const response = await fetch(`/api/admin/crypto-wallets/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    return handleResponse(response);
  },
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },

  static async createShipment(data: ShipmentDetails): Promise<ShipmentDetails> {
    return this.request<ShipmentDetails>('/api/admin/shipments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  static async getShipments(): Promise<ShipmentDetails[]> {
    return this.request<ShipmentDetails[]>('/api/admin/shipments');
  },

  static async getShipmentDetails(id: string): Promise<ShipmentDetails> {
    return this.request<ShipmentDetails>(`/api/admin/shipments/${id}`);
  },

  static async updateShipment(id: string, data: Partial<ShipmentDetails>): Promise<ShipmentDetails> {
    return this.request<ShipmentDetails>(`/api/admin/shipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  static async deleteShipment(id: string): Promise<void> {
    return this.request<void>(`/api/admin/shipments/${id}`, {
      method: 'DELETE',
    });
  },

  static async createShipmentStatus(
    shipmentId: string,
    data: Partial<ShipmentStatus>
  ): Promise<ShipmentStatus> {
    return this.request<ShipmentStatus>(`/api/shipments/${shipmentId}/statuses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  static async uploadPaymentReceipt(
    statusId: string,
    formData: FormData
  ): Promise<ShipmentStatus> {
    return this.request<ShipmentStatus>(`/api/statuses/${statusId}/upload-receipt`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
  },

  static async approvePayment(statusId: string): Promise<ShipmentStatus> {
    return this.request<ShipmentStatus>(`/api/statuses/${statusId}/approve-payment`, {
      method: 'POST',
    });
  },

  static async trackShipment(
    trackingId: string,
    lat: number,
    lng: number
  ): Promise<{ shipmentDetails: ShipmentDetails; shipmentStatuses: ShipmentStatus[] }> {
    return this.request(`/api/track/${trackingId}?lat=${lat}&lng=${lng}`);
  },

  static async uploadReceipt(statusId: string, file: File): Promise<ShipmentStatus> {
    const formData = new FormData();
    formData.append('receiptFile', file);

    return this.request<ShipmentStatus>(`/api/payment/${statusId}/receipt`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
  },

  // Fiat Platform methods
  static async listFiatPlatforms(): Promise<FiatPlatformAttributes[]> {
    return this.request<FiatPlatformAttributes[]>('/api/admin/fiat-platforms');
  },

  static async createFiatPlatform(data: CreateFiatPlatformDto): Promise<FiatPlatformAttributes> {
    return this.request<FiatPlatformAttributes>('/api/admin/fiat-platforms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  static async updateFiatPlatform(id: number, data: UpdateFiatPlatformDto): Promise<FiatPlatformAttributes> {
    return this.request<FiatPlatformAttributes>(`/api/admin/fiat-platforms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  static async deleteFiatPlatform(id: number): Promise<void> {
    return this.request<void>(`/api/admin/fiat-platforms/${id}`, {
      method: 'DELETE',
    });
  },

  static async listSocialMedia(): Promise<SocialMediaAttributes[]> {
    return this.request<SocialMediaAttributes[]>('/api/admin/social-media');
  },

  static async createSocialMedia(data: CreateSocialMediaDto): Promise<SocialMediaAttributes> {
    return this.request<SocialMediaAttributes>('/api/admin/social-media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  static async updateSocialMedia(id: number, data: UpdateSocialMediaDto): Promise<SocialMediaAttributes> {
    return this.request<SocialMediaAttributes>(`/api/admin/social-media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  static async deleteSocialMedia(id: number): Promise<void> {
    return this.request<void>(`/api/admin/social-media/${id}`, {
      method: 'DELETE',
    });
  },

  static async getPaymentInit(statusId: string): Promise<PaymentInitData> {
    return this.request<PaymentInitData>(`/api/payment/${statusId}`);
  }

  static async get(endpoint: string) {
    return this.request(endpoint);
  }

  static async post(endpoint: string, body: any, isFormData: boolean = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  static async put(endpoint: string, body: any, isFormData: boolean = false) {
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  static async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Assumed to be defined elsewhere
async function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API Error: ${response.status} - ${message}`);
  }
  return await response.json();
}