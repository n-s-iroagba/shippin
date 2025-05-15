
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
    create: (adminId: string) => `/admin/shipment-details/${adminId}`,
    list: (adminId: string) => `/admin/shipment/${adminId}`,
    details: (id: string) => `/admin/shipmentdetails/${id}`,
    update: (id: number) => `/admin/shipment-details/${id}`,
    delete: (id: number) => `/admin/shipment-details/${id}`,
  },

  tracking: {
    track: (trackingId: string) => `/track/shipment/${trackingId}`,
    trackApi: (trackingId: string) => `/api/track/${trackingId}`,
  },

  shipmentStatus: {
    create: (shipmentId: number) => `/admin/status/${shipmentId}`,
    update: (statusId: number) => `/admin/status/${statusId}`,
    delete: (statusId: number) => `/admin/status/${statusId}`,
    approvePayment: (shipmentStatusId: string) => `/statuses/${shipmentStatusId}/approve-payment`,
    uploadReceipt: (shipmentStatusId: string) => `/statuses/${shipmentStatusId}/upload-receipt`,
  },

  wallets: {
    create: `/wallets`,
    getByAdmin: (adminId: string) => `/admins/${adminId}/wallets`,
    getByCoinName: (coinName: string) => `/wallets/coin/${coinName}`,
    update: (id: string) => `/wallets/${id}`,
    delete: (id: string) => `/wallets/${id}`,
  },

  fiatPlatform: {
    list: `/admin/fiat-platforms`,
    create: `/admin/fiat-platforms`,
    update: (id: string) => `/admin/fiat-platforms/${id}`,
    delete: (id: string) => `/admin/fiat-platforms/${id}`,
  },

  socialMedia: {
    list: `/admin/social-media`,
    create: `/admin/social-media`,
    update: (id: string) => `/admin/social-media/${id}`,
    delete: (id: string) => `/admin/social-media/${id}`,
  },

  payment: {
    init: (statusId: string) => `/payment/${statusId}`,
  },

  documentTemplate: {
    list: `/admin/templates`,
    create: `/admin/templates`,
    update: (id: string) => `/admin/templates/${id}`,
    delete: (id: string) => `/admin/templates/${id}`,
    download: (id: string) => `/admin/templates/${id}/download`,
  },
};
