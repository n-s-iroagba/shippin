import { SERVER_URL } from "./urls";

export const routes = {
  auth: {
    signUp: `/admin/signup`,
    login: `/admin/login`,
    verifyEmail: `/admin/verify-email`,
    resendVerificationToken: `/admin/resend-verification-token`,
    forgotPassword: `/admin/forgot-password`,
    resetPassword: `/admin/reset-password`,
  },

  shipment: {
    create: (adminId: string) => `${SERVER_URL}/admin/shipment-details/${adminId}`,
    list: (adminId: string) => `${SERVER_URL}/admin/shipment/${adminId}`,
    details: (id: string) => `${SERVER_URL}/admin/shipmentdetails/${id}`,
    update: (id: number) => `${SERVER_URL}/admin/shipment-details/${id}`,
    delete: (id: number) => `${SERVER_URL}/admin/shipment-details/${id}`,
  },

  tracking: {
    track: (trackingId: string) => `${SERVER_URL}/track/shipment/${trackingId}`,
    trackApi: (trackingId: string) => `${SERVER_URL}/api/track/${trackingId}`,
  },

  shippingStage: {
    create: (shipmentId: number) => `${SERVER_URL}/admin/status/${shipmentId}`,
    update: (statusId: number) => `${SERVER_URL}/admin/status/${statusId}`,
    delete: (statusId: number) => `${SERVER_URL}/admin/status/${statusId}`,
    approvePayment: (shippingStageId: string) => `${SERVER_URL}/statuses/${shippingStageId}/approve-payment`,
    uploadReceipt: (shippingStageId: string) => `${SERVER_URL}/statuses/${shippingStageId}/upload-receipt`,
  },

  wallets: {
    create: `/wallets`,
    getByAdmin: (adminId: string) => `${SERVER_URL}/admins/${adminId}/wallets`,
    getByCoinName: (coinName: string) => `${SERVER_URL}/wallets/coin/${coinName}`,
    update: (id: string) => `${SERVER_URL}/wallets/${id}`,
    delete: (id: string) => `${SERVER_URL}/wallets/${id}`,
  },

  fiatPlatform: {
    list: `/admin/fiat-platforms`,
    create: `/admin/fiat-platforms`,
    update: (id: string) => `${SERVER_URL}/admin/fiat-platforms/${id}`,
    delete: (id: string) => `${SERVER_URL}/admin/fiat-platforms/${id}`,
  },

  socialMedia: {
    list: `/admin/social-media`,
    create: `/admin/social-media`,
    update: (id: string) => `${SERVER_URL}/admin/social-media/${id}`,
    delete: (id: string) => `${SERVER_URL}/admin/social-media/${id}`,
  },

  payment: {
    init: (statusId: string) => `${SERVER_URL}/payment/${statusId}`,
  },

  documentTemplate: {
    list: `/admin/templates`,
    create: `/admin/templates`,
    update: (id: string) => `${SERVER_URL}/admin/templates/${id}`,
    delete: (id: string) => `${SERVER_URL}/admin/templates/${id}`,
    download: (id: string) => `${SERVER_URL}/admin/templates/${id}/download`,
  },
};
