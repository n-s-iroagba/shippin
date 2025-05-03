import { Router } from 'express';
import multer from 'multer';
import { approvePayment, createShipmentStatus, deleteShipmentStatus, getShipmentStatusesByShipmentDetailsId, updateShipmentStatus, uploadPaymentReceipt } from './controllers/ShipmentStatusController';
import { createWallet, getWalletsByAdmin, getWalletsByCoinName, updateWallet, deleteWallet } from './controllers/walletController';

// Initialize multer storage (customize as needed)
const upload = multer({ dest: 'uploads/' });

// Support up to 10 supporting documents per status creation
const uploadSupportingDocs = upload.array('supportingDocuments', 10);
// Single file upload for payment receipt
const uploadReceipt = upload.single('paymentReceipt');

const router = Router();

// Create a new shipment status with optional supporting documents
router.post(
  '/shipments/:shipmentDetailsId/statuses',
  uploadSupportingDocs,
  createShipmentStatus
);

router.get('/shipments/:shipmentDetailsId/statuses', getShipmentStatusesByShipmentDetailsId);


// Update an existing shipment status
router.put(
  '/statuses/:shipmentStatusId',
  updateShipmentStatus
);

// Delete a shipment status
router.delete(
  '/statuses/:shipmentStatusId',
  deleteShipmentStatus
);

// Approve payment for a shipment status
router.post(
  '/statuses/:shipmentStatusId/approve-payment',
  approvePayment
);

// Upload payment receipt for a shipment status
router.post(
  '/statuses/:shipmentStatusId/upload-receipt',
  uploadReceipt,
  uploadPaymentReceipt
);


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
export default router;

