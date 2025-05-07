
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api';

export const API_ROUTES = {
  // Auth Routes
  auth: {
    signup: `${API_BASE_URL}/admin/signup`,
    login: `${API_BASE_URL}/admin/login`,
    verifyEmail: `${API_BASE_URL}/admin/verify-email`,
    resendVerification: `${API_BASE_URL}/admin/resend-verification-token`,
    forgotPassword: `${API_BASE_URL}/admin/forgot-password`,
    resetPassword: `${API_BASE_URL}/admin/reset-password`,
  },

  // Shipment Routes
  shipments: {
    create: (adminId: number) => `${API_BASE_URL}/admin/shipment-details/${adminId}`,
    list: (adminId: number) => `${API_BASE_URL}/admin/shipment/${adminId}`,
    details: (id: number) => `${API_BASE_URL}/admin/shipmentdetails/${id}`,
    update: (id: number) => `${API_BASE_URL}/admin/shipment-details/${id}`,
    delete: (id: number) => `${API_BASE_URL}/admin/shipment-details/${id}`,
    track: (trackingId:string)=> `${API_BASE_URL}/track/shipment/${trackingId}`,
  },

  // Shipment Status Routes
  status: {
    create: (shipmentId: number) => `${API_BASE_URL}/admin/status/${shipmentId}`,
    update: (statusId: number) => `${API_BASE_URL}/admin/status/${statusId}`,
    delete: (statusId: number) => `${API_BASE_URL}/admin/status/${statusId}`,
    approvePayment: (statusId: number) => `${API_BASE_URL}/statuses/${statusId}/approve-payment`,
    uploadReceipt: (statusId: number) => `${API_BASE_URL}/statuses/${statusId}/upload-receipt`,
  },


  // Wallet Routes
  wallets: {
    create: `${API_BASE_URL}/wallets`,
    listByAdmin: (adminId: number) => `${API_BASE_URL}/admins/${adminId}/wallets`,
    listByCoin: (coinName: string) => `${API_BASE_URL}/wallets/coin/${coinName}`,
    update: (id: number) => `${API_BASE_URL}/wallets/${id}`,
    delete: (id: number) => `${API_BASE_URL}/wallets/${id}`,
  },

  // Fiat Platform Routes
  fiatPlatforms: {
    list: `${API_BASE_URL}/admin/fiat-platforms`,
    create: `${API_BASE_URL}/admin/fiat-platforms`,
    update: (id: number) => `${API_BASE_URL}/admin/fiat-platforms/${id}`,
    delete: (id: number) => `${API_BASE_URL}/admin/fiat-platforms/${id}`,
  },

  // Social Media Routes
  socialMedia: {
    list: `${API_BASE_URL}/admin/social-media`,
    create: `${API_BASE_URL}/admin/social-media`,
    update: (id: number) => `${API_BASE_URL}/admin/social-media/${id}`,
    delete: (id: number) => `${API_BASE_URL}/admin/social-media/${id}`,
  },

  // Document Template Routes
  templates: {
    list: `${API_BASE_URL}/admin/templates`,
    create: `${API_BASE_URL}/admin/templates`,
    update: (id: number) => `${API_BASE_URL}/admin/templates/${id}`,
    delete: (id: number) => `${API_BASE_URL}/admin/templates/${id}`,
    download: (id: number) => `${API_BASE_URL}/admin/templates/${id}/download`,
  },

  // Payment Routes
  payment: {
    init: (statusId: number) => `${API_BASE_URL}/payment/${statusId}`,
  },
};

export default API_ROUTES;
