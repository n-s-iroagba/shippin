import { CreateCryptoWalletDto, UpdateCryptoWalletDto } from "@/types/crypto-wallet.types";
import { FiatPlatformAttributes, CreateFiatPlatformDto, UpdateFiatPlatformDto } from "@/types/fiat-platform.types";
import { ShipmentDetails, ShipmentStatus } from "@/types/shipment.types";
import { SocialMediaAttributes, CreateSocialMediaDto, UpdateSocialMediaDto } from "@/types/social-media.types";


export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const headers = new Headers(options?.headers);
      if (!headers.has('Authorization')) {
        headers.append('Authorization', `Bearer ${localStorage.getItem('admin_token')}`);
      }
      if (!(options?.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
      }

      const response = await fetch(endpoint, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Document Templates
  static async listDocumentTemplates() {
    return this.request('/api/admin/templates');
  }

  static async createDocumentTemplate(formData: FormData) {
    return this.request('/api/admin/templates', {
      method: 'POST',
      body: formData,
    });
  }

  static async updateDocumentTemplate(id: number, formData: FormData) {
    return this.request(`/api/admin/templates/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  static async deleteDocumentTemplate(id: number) {
    return this.request(`/api/admin/templates/${id}`, { method: 'DELETE' });
  }

  // Crypto Wallets
  static async listCryptoWallets() {
    return this.request('/api/admin/crypto-wallets');
  }

  static async createCryptoWallet(data: CreateCryptoWalletDto) {
    return this.request('/api/admin/crypto-wallets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateCryptoWallet(id: number, data: UpdateCryptoWalletDto) {
    return this.request(`/api/admin/crypto-wallets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteCryptoWallet(id: number) {
    return this.request(`/api/admin/crypto-wallets/${id}`, { method: 'DELETE' });
  }

  // Shipments
  static async createShipment(data: ShipmentDetails): Promise<ShipmentDetails> {
    return this.request<ShipmentDetails>('/api/admin/shipments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getShipments(): Promise<ShipmentDetails[]> {
    return this.request<ShipmentDetails[]>('/api/admin/shipments');
  }

  static async getShipmentDetails(id: string): Promise<ShipmentDetails> {
    return this.request<ShipmentDetails>(`/api/admin/shipments/${id}`);
  }

  static async updateShipment(id: string, data: Partial<ShipmentDetails>): Promise<ShipmentDetails> {
    return this.request<ShipmentDetails>(`/api/admin/shipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteShipment(id: string): Promise<void> {
    return this.request<void>(`/api/admin/shipments/${id}`, { method: 'DELETE' });
  }

  // Shipment Statuses
  static async createShipmentStatus(shipmentId: string, data: Partial<ShipmentStatus>): Promise<ShipmentStatus> {
    return this.request<ShipmentStatus>(`/api/shipments/${shipmentId}/statuses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async uploadPaymentReceipt(statusId: string, formData: FormData): Promise<ShipmentStatus> {
    return this.request<ShipmentStatus>(`/api/statuses/${statusId}/upload-receipt`, {
      method: 'POST',
      body: formData,
    });
  }

  static async approvePayment(statusId: string): Promise<ShipmentStatus> {
    return this.request<ShipmentStatus>(`/api/statuses/${statusId}/approve-payment`, { method: 'POST' });
  }

  static async trackShipment(trackingId: string, lat: number, lng: number) {
    const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
    return this.request<{ 
      shipmentDetails: ShipmentDetails; 
      shipmentStatuses: ShipmentStatus[] 
    }>(`/api/track/${trackingId}?${params}`);
  }

  static async uploadReceipt(statusId: string, file: File): Promise<ShipmentStatus> {
    const formData = new FormData();
    formData.append('receiptFile', file);
    return this.request<ShipmentStatus>(`/api/payment/${statusId}/receipt`, { method: 'POST', body: formData });
  }

  // Fiat Platforms
  static async listFiatPlatforms(): Promise<FiatPlatformAttributes[]> {
    return this.request<FiatPlatformAttributes[]>('/api/admin/fiat-platforms');
  }

  static async createFiatPlatform(data: CreateFiatPlatformDto): Promise<FiatPlatformAttributes> {
    return this.request<FiatPlatformAttributes>('/api/admin/fiat-platforms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateFiatPlatform(id: number, data: UpdateFiatPlatformDto): Promise<FiatPlatformAttributes> {
    return this.request<FiatPlatformAttributes>(`/api/admin/fiat-platforms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteFiatPlatform(id: number): Promise<void> {
    return this.request<void>(`/api/admin/fiat-platforms/${id}`, { method: 'DELETE' });
  }

  // Social Media
  static async listSocialMedia(): Promise<SocialMediaAttributes[]> {
    return this.request<SocialMediaAttributes[]>('/api/admin/social-media');
  }

  static async createSocialMedia(data: CreateSocialMediaDto): Promise<SocialMediaAttributes> {
    return this.request<SocialMediaAttributes>('/api/admin/social-media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateSocialMedia(id: number, data: UpdateSocialMediaDto): Promise<SocialMediaAttributes> {
    return this.request<SocialMediaAttributes>(`/api/admin/social-media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteSocialMedia(id: number): Promise<void> {
    return this.request<void>(`/api/admin/social-media/${id}`, { method: 'DELETE' });
  }

  // Payment
  static async getPaymentInit(statusId: string): Promise<PaymentInitData> {
    return this.request<PaymentInitData>(`/api/payment/${statusId}`);
  }
}