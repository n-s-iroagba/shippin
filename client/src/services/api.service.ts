
import { CreateCryptoWalletDto, UpdateCryptoWalletDto } from "@/types/crypto-wallet.types";
import { CreateFiatPlatformDto, UpdateFiatPlatformDto } from "@/types/fiat-platform.types";
import { ShipmentDetails, ShipmentStatus } from "@/types/shipment.types";
import { CreateSocialMediaDto, UpdateSocialMediaDto } from "@/types/social-media.types";
import { API_ROUTES } from "@/data/urls";

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
     const data =await response.json()
     console.log(data)
     return data
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth Services
  static async signup(data: { email: string, password: string, name: string }): Promise<{ verificationToken: string, error: { code: number, message: string } }> {
    return this.request(API_ROUTES.auth.signup, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async login(data: { email: string, password: string }) {
    return this.request(API_ROUTES.auth.login, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async verifyEmail(data: { code: string, verificationToken: string }): Promise<{ token: string, error: { code: number, message: string } }> {
    return this.request(API_ROUTES.auth.verifyEmail, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  static async resendVerification(token: string): Promise<{ verificationToken: string, error: { code: number, message: string } }> {
    return this.request(API_ROUTES.auth.resendVerification, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async forgotPassword(email: string) {
    return this.request(API_ROUTES.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(token: string, password: string) {
    return this.request(API_ROUTES.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Shipment Services
  static async createShipment(adminId: number, data: Partial<ShipmentDetails>) {
    return this.request(API_ROUTES.shipments.create(adminId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async listShipments(adminId: number): Promise<{ shipments: ShipmentDetails[], error: { code: number, message: string } }> {
    return this.request(API_ROUTES.shipments.list(adminId));
  }

  static async getShipmentDetails(id: number) : Promise<{ shipment: ShipmentDetails, statuses:ShipmentStatus[], error?: { code: number, message: string } }> {
    return this.request(API_ROUTES.shipments.details(id));
  }

  static async trackShipment(trackingId: string) : Promise<{ shipment: ShipmentDetails, statuses:ShipmentStatus[], error?: { code: number, message: string } }> {
    return this.request(API_ROUTES.shipments.track(trackingId));
  }


  static async updateShipment(id: number, data: Partial<ShipmentDetails>) {
    return this.request(API_ROUTES.shipments.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteShipment(id: number) {
    return this.request(API_ROUTES.shipments.delete(id), {
      method: 'DELETE',
    });
  }

  // Shipment Status Services
  static async createStatus(shipmentId: number, data: FormData): Promise<{ status: ShipmentStatus, error: { code: number, message: string } }> {
    return this.request(API_ROUTES.status.create(shipmentId), {
      method: 'POST',
      body: data,
    })
  }

  static async updateStatus(statusId: number, data: FormData) {
    return this.request(API_ROUTES.status.update(statusId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteStatus(statusId: number) {
    return this.request(API_ROUTES.status.delete(statusId), {
      method: 'DELETE',
    });
  }

  static async approvePayment(statusId: number) {
    return this.request(API_ROUTES.status.approvePayment(statusId), {
      method: 'POST',
    });
  }

  static async uploadReceipt(statusId: number, receipt: FormData) {
    return this.request(API_ROUTES.status.uploadReceipt(statusId), {
      method: 'POST',
      body: receipt,
    });
  }


  // Wallet Services
  static async createWallet(data: CreateCryptoWalletDto) {
    return this.request(API_ROUTES.wallets.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getWalletsByAdmin(adminId: number) {
    return this.request(API_ROUTES.wallets.listByAdmin(adminId));
  }

  static async getWalletsByCoin(coinName: string) {
    return this.request(API_ROUTES.wallets.listByCoin(coinName));
  }

  static async updateWallet(id: number, data: UpdateCryptoWalletDto) {
    return this.request(API_ROUTES.wallets.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteWallet(id: number) {
    return this.request(API_ROUTES.wallets.delete(id), {
      method: 'DELETE',
    });
  }

  // Fiat Platform Services
  static async listFiatPlatforms() {
    return this.request(API_ROUTES.fiatPlatforms.list);
  }

  static async createFiatPlatform(data: CreateFiatPlatformDto) {
    return this.request(API_ROUTES.fiatPlatforms.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateFiatPlatform(id: number, data: UpdateFiatPlatformDto) {
    return this.request(API_ROUTES.fiatPlatforms.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteFiatPlatform(id: number) {
    return this.request(API_ROUTES.fiatPlatforms.delete(id), {
      method: 'DELETE',
    });
  }

  // Social Media Services
  static async listSocialMedia() {
    return this.request(API_ROUTES.socialMedia.list);
  }

  static async createSocialMedia(data: CreateSocialMediaDto) {
    return this.request(API_ROUTES.socialMedia.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateSocialMedia(id: number, data: UpdateSocialMediaDto) {
    return this.request(API_ROUTES.socialMedia.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteSocialMedia(id: number) {
    return this.request(API_ROUTES.socialMedia.delete(id), {
      method: 'DELETE',
    });
  }

  // Document Template Services
  static async listDocumentTemplates() {
    return this.request(API_ROUTES.templates.list);
  }

  static async createDocumentTemplate(data: FormData) {
    return this.request(API_ROUTES.templates.create, {
      method: 'POST',
      body: data,
    });
  }

  static async updateDocumentTemplate(id: number, data: FormData) {
    return this.request(API_ROUTES.templates.update(id), {
      method: 'PUT',
      body: data,
    });
  }

  static async deleteDocumentTemplate(id: number) {
    return this.request(API_ROUTES.templates.delete(id), {
      method: 'DELETE',
    });
  }

  static async downloadDocumentTemplate(id: number) {
    return this.request(API_ROUTES.templates.download(id));
  }

  // Payment Services
  static async getPaymentInit(statusId: number) {
    return this.request(API_ROUTES.payment.init(statusId));
  }
}
