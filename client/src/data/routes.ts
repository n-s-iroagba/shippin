export const routes = {
  shipment: {
    create: (adminId: number) => `/admin/shipment/${adminId}`,
    list: (adminId: number) => `/admin/shipment/${adminId}`,
    details: (id: number) => `/admin/shipmentdetails/${id}`,
    update: (id: number) => `/admin/shipment-details/${id}`,
    delete: (id: number) => `/admin/shipment-details/${id}`,
    track: (trackingId: number) => `/track/shipment/${trackingId}`,
  },
  stage: {
    create: (shipmentId: number) => `/admin/stage/${shipmentId}`,
    update: (stageId: number) => `/admin/stage/${stageId}`,
    unapprovedPayments:(adminId: number) => `/admin/stage/unapproved-payments/${adminId}`,
    delete: (stageId: number) => `/admin/stage/${stageId}`,
    approvePayment: (StageId: number) => `/stagees/${StageId}/approve-payment`,
    uploadReceipt: (StageId: number) => `/stagees/${StageId}/upload-receipt`,
  },
 
  auth: {
    signup: `/admin/signup`,
    login: `/admin/login`,
    verifyEmail: `/admin/verify-email`,
    resendVerificationToken: `/admin/resend-verification-token`,
    forgotPassword: `/admin/forgot-password`,
    resetPassword: `/admin/reset-password`,
    logout:'/admin/logout',
    me:'/admin/me'
  },
  socialMedia: {
    list: (adminId: number) =>`/api/admin/social-media/${adminId}`,
    create: (adminId: number) =>`/api/admin/social-media/${adminId}`,
    update: (id: number) => `/api/admin/social-media/${id}`,
    delete: (id: number) => `/api/admin/social-media/${id}`,
  },
   cryptoWallet: {
  list: (adminId: number) =>`/api/admin/crypto-wallet/${adminId}`,
    create: (adminId: number) =>`/api/admin/crypto-wallet/${adminId}`,
    update: (id: number) => `/api/admin/crypto-wallet/${id}`,
    delete: (id: number) => `/api/admin/crypto-wallet/${id}`,
  },
  templates: {
    list: (adminId: number) => `/admin/templates/${adminId}`,
    create: (adminId: number) => `/admin/templates/${adminId}`,
    update: (adminId: number, id: number) => `/admin/templates/${adminId}/${id}`,
    delete: (adminId: number, id: number) => `/admin/templates/${adminId}/${id}`,
    download: (adminId: number, id: number) => `/admin/templates/${adminId}/${id}/download`,
  }
};
