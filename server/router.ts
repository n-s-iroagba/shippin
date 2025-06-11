import express from "express"
import multer from "multer"
import { documentTemplateController } from "./controllers/documentTemplateController"

import { shipmentController } from "./controllers/shipmentController"

import {
  signUp,
  login,
  verifyEmail,
  resendVerificationToken,
  forgotPassword,
  resetPassword,
} from "./controllers/authController"

import { uploadDocument, uploadPayment, uploadTemplate, uploadSupportingDoc } from "./middleware/upload"
import StageController from "./controllers/StageController"
import { socialMediaController } from "./controllers/socialMediaController"
import { authenticate } from "./middleware/authenticate"
import { cryptoWalletController } from "./controllers/cryptoWalletController"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

router.post("/admin/shipment/:adminId", shipmentController.createShipment)
router.get("/admin/shipment/:adminId", shipmentController.listShipments)
router.get("/admin/shipmentdetails/:id", shipmentController.getShipment)
router.patch("/admin/shipment-details/:id", shipmentController.updateShipment)
router.delete("/admin/shipment-details/:id", shipmentController.deleteShipment)
router.get("/track/shipment/:trackingId", shipmentController.trackShipment)

router.post("/admin/stage/:shipmentId",uploadDocument.single("supportingDocument"),StageController.createstage)
router.patch("/admin/stage/:stageId",uploadDocument.single("supportingDocument"),StageController.updatestage)
router.get("//admin/stage/unapproved-payments/:adminId",StageController.liststageWithUnApprovedPayment)
router.delete("/admin/stage/:stageId", StageController.deleteStage)
router.post("/stages/:StageId/approve-payment", StageController.approvePayment)
router.post("/stages/:StageId/upload-receipt", uploadPayment.single('paymentReceipt'), StageController.uploadReceipt)
router.post("/shipping-stages/:shipmentId",uploadSupportingDoc.single("supportingDocument"),StageController.createstage)
router.patch("/shipping-stages/:stageId",uploadSupportingDoc.single("supportingDocument"),StageController.updatestage)

router.post("/admin/signup", signUp)
router.post("/admin/login", login)
router.post("/admin/verify-email", verifyEmail)
router.post("/admin/resend-verification-token", resendVerificationToken)
router.post("/admin/forgot-password", forgotPassword)
router.post("/admin/reset-password", resetPassword)
router.get("/admin/logout", logout)
router.get("/admin/me", getMe)

router.get("/admin/crypto-wallet/:adminId", cryptoWalletController.list)
router.post("/admin/crypto-wallet/:adminId", cryptoWalletController.create)
router.put("/admin/crypto-wallet/:id", cryptoWalletController.update)
router.delete("/admin/crypto-wallet/:id", cryptoWalletController.remove)

router.get("/admin/social-media/:adminId", socialMediaController.list)
router.post("/admin/social-media/:adminId", socialMediaController.create)
router.put("/admin/social-media/:id", socialMediaController.update)
router.delete("/admin/social-media/:id", socialMediaController.remove)

router.get("/admin/templates/:adminId", upload.single("file"), documentTemplateController.listTemplates)
router.post("/admin/templates/:adminId", upload.single("file"), documentTemplateController.createTemplate)
router.put("/admin/templates/:adminId/:id", upload.single("file"), documentTemplateController.updateTemplate)
router.delete("/admin/templates/:adminId/:id", documentTemplateController.deleteTemplate)
router.get("/admin/templates/:adminId/:id/download", documentTemplateController.downloadTemplate)


export default router

