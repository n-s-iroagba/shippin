import express from "express"
import { documentTemplateController } from "./controllers/documentTemplateController"
import { shipmentController } from "./controllers/shipmentController"
import {
  signUp,
  login,
  verifyEmail,
  resendVerificationToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe
} from "./controllers/authController"
import { uploadDocument, uploadPayment, uploadTemplate, uploadSupportingDoc } from "./middleware/upload"
import { stageController } from "./controllers/stageController"
import { socialMediaController } from "./controllers/socialMediaController"
import { authenticate } from "./middleware/authenticate"
import { cryptoWalletController } from "./controllers/cryptoWalletController"

const router = express.Router()

// Shipment routes
router.post("/admin/shipment/:adminId",authenticate, shipmentController.createShipment)
router.get("/admin/shipment/:adminId", shipmentController.listShipments)
router.get("/admin/shipmentdetails/:id", shipmentController.getShipment)
router.patch("/admin/shipment-details/:id", shipmentController.updateShipment)
router.delete("/admin/shipment-details/:id", shipmentController.deleteShipment)
router.get("/track/shipment/:trackingId", shipmentController.trackShipment)

// Stage routes
router.post("/admin/stage/:shipmentId", uploadDocument.single("supportingDocument"), stageController.createStage)
router.patch("/admin/stage/:stageId", uploadDocument.single("supportingDocument"), stageController.updateStage)
router.get("/admin/stage/unapproved-payments/:adminId", stageController.listStagesWithUnapprovedPayment)
router.delete("/admin/stage/:stageId", stageController.deleteStage)
router.post("/admin/stage/:stageId/upload-receipt", uploadPayment.single('paymentReceipt'), stageController.uploadReceipt)

// Payment status toggle routes (replacing verify-payment)
router.patch("/admin/stage/:stageId/toggle-payment-status", stageController.togglePaymentStatus)
router.patch("/admin/stage/:stageId/quick-toggle-payment", stageController.quickTogglePayment)

router.get("/admin/stage/:stageId/receipts", stageController.getPaymentReceipts)

// Auth routes
router.post("/admin/signup", signUp)
router.post("/admin/login", login)
router.post("/admin/verify-email", verifyEmail)
router.post("/admin/resend-verification-token", resendVerificationToken)
router.post("/admin/forgot-password", forgotPassword)
router.post("/admin/reset-password", resetPassword)
router.get("/admin/logout", logout)
router.get("/admin/me", getMe)

// Crypto wallet routes
router.get("/admin/crypto-wallet/:adminId", cryptoWalletController.list)
router.post("/admin/crypto-wallet/:adminId", cryptoWalletController.create)
router.put("/admin/crypto-wallet/:id", cryptoWalletController.update)
router.delete("/admin/crypto-wallet/:id", cryptoWalletController.remove)

// Social media routes
router.get("/admin/social-media/:adminId", socialMediaController.list)
router.post("/admin/social-media/:adminId", socialMediaController.create)
router.put("/admin/social-media/:id", socialMediaController.update)
router.delete("/admin/social-media/:id", socialMediaController.remove)

// Document template routes
router.get("/admin/templates/:adminId", documentTemplateController.list)
router.post("/admin/templates/:adminId", uploadTemplate.single("file"), documentTemplateController.create)
router.put("/admin/templates/:id", uploadTemplate.single("file"), documentTemplateController.update)
router.delete("/admin/templates/:id", documentTemplateController.remove)
router.get("/admin/templates/:id/download", documentTemplateController.downloadTemplate)

export default router

