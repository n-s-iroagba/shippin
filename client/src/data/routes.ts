export const routes = {
  shipment: {
    create: (adminId: number) => `/admin/shipment/${adminId}`,
    list: (adminId: number) => `/admin/shipment/${adminId}`,
    details: (id: number) => `/admin/shipmentdetails/${id}`,
    update: (id: number) => `/admin/shipment-details/${id}`,
    delete: (id: number) => `/admin/shipment-details/${id}`,
    track: (trackingId: number) => `/track/shipment/${trackingId}`,
  },
  status: {
    create: (shipmentId: number) => `/admin/status/${shipmentId}`,
    update: (statusId: number) => `/admin/status/${statusId}`,
    unapprovedPayments: `/admin/status/unapproved-payments`,
    delete: (statusId: number) => `/admin/status/${statusId}`,
    approvePayment: (shippingStageId: number) => `/statuses/${shippingStageId}/approve-payment`,
    uploadReceipt: (shippingStageId: number) => `/statuses/${shippingStageId}/upload-receipt`,
  },
  shippingStages: {
    create: (shipmentId: number) => `/shipping-stages/${shipmentId}`,
    update: (statusId: number) => `/shipping-stages/${statusId}`,
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
    list: `/api/admin/social-media`,
    create: `/api/admin/social-media`,
    update: (id: number) => `/api/admin/social-media/${id}`,
    delete: (id: number) => `/api/admin/social-media/${id}`,
  },
  templates: {
    list: (adminId: number) => `/admin/templates/${adminId}`,
    create: (adminId: number) => `/admin/templates/${adminId}`,
    update: (adminId: number, id: number) => `/admin/templates/${adminId}/${id}`,
    delete: (adminId: number, id: number) => `/admin/templates/${adminId}/${id}`,
    download: (adminId: number, id: number) => `/admin/templates/${adminId}/${id}/download`,
  }
};
