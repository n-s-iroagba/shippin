import { Router } from "express";
import { signUp, login, verifyEmail, resendVerificationToken, forgotPassword, resetPassword } from "./controllers/authController";
import { listTemplates, createTemplate, updateTemplate, deleteTemplate, downloadTemplate } from "./controllers/documentTemplateController";

import { shipmentController } from "./controllers/shipmentController";
import { trackingController } from "./controllers/trackingController";

import { uploadDocument, uploadPayment, uploadTemplate } from "./middleware/upload";
import shippingStageController from "./controllers/ShippingStageController";
import { socialMediaController } from "./controllers/socialMediaController";

import fs from 'fs';

const uploadReceipt = uploadPayment.single('paymentReceipt');

const router = Router();


// Shipment routes
router.post('/admin/shipment-details/:adminId',  shipmentController.createShipment);
router.get('/admin/shipment/:adminId',  shipmentController.listShipments);
router.get('/admin/shipmentdetails/:id',  shipmentController.getShipmentDetails);
router.patch('/admin/shipment-details/:id',  shipmentController.updateShipment);
router.delete('/admin/shipment-details/:id',  shipmentController.deleteShipment);

//track Shipment
router.get('/track/shipment/:trackingId',  trackingController.trackShipment);

// Shipment status routes
router.post('/admin/status/:shipmentId', uploadDocument.single('supportingDocument'), shippingStageController.createStatus);
router.patch('/admin/status/:statusId', uploadDocument.single('supportingDocument'), shippingStageController.updateStatus);
router.delete('/admin/status/:statusId',  shippingStageController.deleteShippingStage);

router.post( '/statuses/:shippingStageId/approve-payment',shippingStageController.approvePayment);
router.post('/statuses/:shippingStageId/upload-receipt',uploadReceipt,shippingStageController.uploadReceipt);

router.post('/admin/signup', signUp);
router.post('/admin/login', login);
router.post('/admin/verify-email', verifyEmail);
router.post('/admin/resend-verification-token', resendVerificationToken);
router.post('/admin/forgot-password', forgotPassword);
router.post('/admin/reset-password', resetPassword);

// Tracking routes
router.get('/api/track/:trackingId', trackingController.trackShipment);



// Social Media routes -  Assuming the existence of socialMediaController
router.get('/api/admin/social-media',  socialMediaController.list);
router.post('/api/admin/social-media',  socialMediaController.create);
router.put('/api/admin/social-media/:id',  socialMediaController.update);
router.delete('/api/admin/social-media/:id',  socialMediaController.remove);


// Document Template routes
router.get('/api/admin/templates', listTemplates);
router.post('/api/admin/templates', uploadTemplate.single('file'), createTemplate);
router.put('/api/admin/templates/:id', uploadTemplate.single('file'), updateTemplate);
router.delete('/api/admin/templates/:id', deleteTemplate);
router.get('/api/admin/templates/:id/download', downloadTemplate);

// Create directory for uploads if it doesn't exist
const uploadDirs = ['./uploads/templates', './uploads/supporting-docs'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});



export default router;