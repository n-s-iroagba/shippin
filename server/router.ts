


// Initialize multer storage (customize as needed)

import { Router } from "express";
import { signUp, login, verifyEmail, resendVerificationToken, forgotPassword, resetPassword } from "./controllers/authController";
import { listTemplates, createTemplate, updateTemplate, deleteTemplate, downloadTemplate } from "./controllers/documentTemplateController";
import { fiatPlatformController } from "./controllers/fiatPlatformController";
import { shipmentController } from "./controllers/shipmentController";
import { trackingController } from "./controllers/trackingController";
import { createWallet, getWalletsByAdmin, getWalletsByCoinName, updateWallet, deleteWallet } from "./controllers/walletController";
import { uploadDocument, uploadPayment, uploadTemplate } from "./middleware/upload";
import shipmentStatusController from "./controllers/ShipmentStatusController";
import { } from "./middleware/auth";
import { socialMediaController } from "./controllers/socialMediaController";
import { getPaymentInit } from "./controllers/paymentController";

// Multer middleware configurations
const uploadSupportingDocs = uploadDocument.array('supportingDocument', 10);
const uploadReceipt = uploadPayment.single('paymentReceipt');

const router = Router();


// Shipment routes
router.post('/admin/shipment-details/:adminId',  shipmentController.createShipment);
router.get('/admin/shipment/:adminId',  shipmentController.listShipments);
router.get('/admin/shipmentdetails/:id',  shipmentController.getShipmentDetails);
router.put('/admin/shipment-details/:id',  shipmentController.updateShipment);
router.delete('/admin/shipment-details/:id',  shipmentController.deleteShipment);

//track Shipment
router.get('/track/shipment/:trackingId',  trackingController.trackShipment);

// Shipment status routes
router.post('/admin/status/:shipmentId',  uploadSupportingDocs, shipmentStatusController.createStatus);
router.put('/admin/status/:statusId',  shipmentStatusController.updateStatus);
router.delete('/admin/status/:statusId',  shipmentStatusController.deleteShipmentStatus);
// router.get('/shipments/:shipmentDetailsId/statuses', shipmentStatusController.getShipmentStatusesByShipmentDetailsId);
router.post(
  '/statuses/:shipmentStatusId/approve-payment',
  shipmentStatusController.approvePayment
);
router.post(
  '/statuses/:shipmentStatusId/upload-receipt',
  uploadReceipt,
  shipmentStatusController.uploadPaymentReceipt
);


// Original routes remain (assuming no conflicts)
router.post('/admin/signup', signUp);
router.post('/admin/login', login);
router.post('/admin/verify-email', verifyEmail);
router.post('/admin/resend-verification-token', resendVerificationToken);
router.post('/admin/forgot-password', forgotPassword);
router.post('/admin/reset-password', resetPassword);





// Create
router.post('/wallets', createWallet);
// Read by admin
router.get('/admins/:adminId/wallets', getWalletsByAdmin);
// Read by coinName
router.get('/wallets/coin/:coinName', getWalletsByCoinName);
// Update
router.put('/wallets/:id', updateWallet);
// Delete
router.delete('/wallets/:id', deleteWallet);

// Tracking routes
router.get('/api/track/:trackingId', trackingController.trackShipment);

// Fiat Platform routes
router.get('/api/admin/fiat-platforms',  fiatPlatformController.list);
router.post('/api/admin/fiat-platforms',  fiatPlatformController.create);
router.put('/api/admin/fiat-platforms/:id',  fiatPlatformController.update);
router.delete('/api/admin/fiat-platforms/:id',  fiatPlatformController.delete);

// Social Media routes -  Assuming the existence of socialMediaController
router.get('/api/admin/social-media',  socialMediaController.list);
router.post('/api/admin/social-media',  socialMediaController.create);
router.put('/api/admin/social-media/:id',  socialMediaController.update);
router.delete('/api/admin/social-media/:id',  socialMediaController.remove);

// Payment routes - Assuming the existence of paymentController
router.get('/api/payment/:statusId',getPaymentInit);

// Document Template routes
router.get('/api/admin/templates',  listTemplates);
router.post('/api/admin/templates',  uploadTemplate.single('file'), createTemplate);
router.put('/api/admin/templates/:id',  uploadTemplate.single('file'), updateTemplate);
router.delete('/api/admin/templates/:id',  deleteTemplate);
router.get('/api/admin/templates/:id/download',  downloadTemplate);



export default router;