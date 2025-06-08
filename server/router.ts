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
import shippingStageController from "./controllers/ShippingStageController"
import { socialMediaController } from "./controllers/socialMediaController"
import { authenticate } from "./middleware/authenticate"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

router.post("/admin/shipment/:adminId", shipmentController.createShipment)
router.get("/admin/shipment/:adminId", shipmentController.listShipments)
router.get("/admin/shipmentdetails/:id", shipmentController.getShipmentDetails)
router.patch("/admin/shipment-details/:id", shipmentController.updateShipment)
router.delete("/admin/shipment-details/:id", shipmentController.deleteShipment)
router.get("/track/shipment/:trackingId", shipmentController.trackShipment)

router.post("/admin/status/:shipmentId",uploadDocument.single("supportingDocument"),shippingStageController.createStatus)
router.patch("/admin/status/:statusId",uploadDocument.single("supportingDocument"),shippingStageController.updateStatus)
router.get("/admin/status/unapproved-payments",shippingStageController.listStatusWithUnApprovedPayment)
router.delete("/admin/status/:statusId", shippingStageController.deleteShippingStage)
router.post("/statuses/:shippingStageId/approve-payment", shippingStageController.approvePayment)
router.post("/statuses/:shippingStageId/upload-receipt", uploadPayment.single('paymentReceipt'), shippingStageController.uploadReceipt)
router.post("/shipping-stages/:shipmentId",uploadSupportingDoc.single("supportingDocument"),shippingStageController.createStatus)
router.patch("/shipping-stages/:statusId",uploadSupportingDoc.single("supportingDocument"),shippingStageController.updateStatus)

router.post("/admin/signup", signUp)
router.post("/admin/login", login)
router.post("/admin/verify-email", verifyEmail)
router.post("/admin/resend-verification-token", resendVerificationToken)
router.post("/admin/forgot-password", forgotPassword)
router.post("/admin/reset-password", resetPassword)
router.get("/admin/logout", logout)
router.get("/admin/me", getMe)


router.get("/api/admin/social-media", socialMediaController.list)
router.post("/api/admin/social-media", socialMediaController.create)
router.put("/api/admin/social-media/:id", socialMediaController.update)
router.delete("/api/admin/social-media/:id", socialMediaController.remove)

router.get("/admin/templates/:adminId", upload.single("file"), documentTemplateController.listTemplates)
router.post("/admin/templates/:adminId", upload.single("file"), documentTemplateController.createTemplate)
router.put("/admin/templates/:adminId/:id", upload.single("file"), documentTemplateController.updateTemplate)
router.delete("/admin/templates/:adminId/:id", documentTemplateController.deleteTemplate)
router.get("/admin/templates/:adminId/:id/download", documentTemplateController.downloadTemplate)


export default router

