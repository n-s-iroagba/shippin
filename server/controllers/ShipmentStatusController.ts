import { Request, Response, NextFunction } from 'express';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { CustomError } from '../CustomError';


export const createShipmentStatus = async (
  req:Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { shipmentDetailsId } = req.params;
  const {
    dateAndTime,
    carrierNote,
    requiresFee = false,
    percentageNote = null,
    feeInDollars = null,
    title
  } = req.body;

  try {
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
    if (!shipment) {
      throw new CustomError(404, 'Shipment details not found');
    }

    // Handle uploaded supporting documents if any
    const uploadedDocs = (req as Request & { files?: Express.Multer.File[] }).files?.map((file) => file.path) || [];

    const status = await ShipmentStatus.create({
      shipmentDetailsId:Number(shipmentDetailsId),
      dateAndTime,
      carrierNote,
      requiresFee,
      paymentStatus: requiresFee ? 'YET_TO_BE_PAID' : 'NO_NEED_FOR_PAYMENT',
      feeInDollars,
      percentageNote,
      supportingDocuments: uploadedDocs,
      title,
    });

    res.status(201).json(status);
  } catch (err) {
    console.error('Error creating ShipmentStatus:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

export const updateShipmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { shipmentStatusId } = req.params;
  const updateData = req.body;

  try {
    const [updatedCount] = await ShipmentStatus.update(updateData, {
      where: { id: shipmentStatusId },
    });

    if (updatedCount === 0) {
      throw new CustomError(404, 'ShipmentStatus not found');
    }

    const updated = await ShipmentStatus.findByPk(shipmentStatusId);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating ShipmentStatus:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

export const getShipmentStatusesByShipmentDetailsId = async (req: Request, res: Response): Promise<any> => {
  const { shipmentDetailsId } = req.params;

  try {

    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
    if (!shipment) {
      throw new CustomError(404, 'ShipmentDetails not found');
    }

    const statuses = await ShipmentStatus.findAll({
      where: { shipmentDetailsId: shipment.id },
      order: [['dateAndTime', 'ASC']], 
    });

    return res.status(200).json(statuses);
  } catch (error) {
    console.error('Error fetching shipment statuses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const deleteShipmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { shipmentStatusId } = req.params;

  try {
    const status = await ShipmentStatus.findByPk(shipmentStatusId);
    if (!status) {
      throw new CustomError(404, 'ShipmentStatus not found');
    }
    await status.destroy();
    res.status(200).json({ message: 'ShipmentStatus deleted successfully' });
  } catch (err) {
    console.error('Error deleting ShipmentStatus:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

export const approvePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { shipmentStatusId } = req.params;
  const { paymentDate, amountPaid } = req.body;

  try {
    const status = await ShipmentStatus.findByPk(shipmentStatusId);
    if (!status) {
      throw new CustomError(404, 'ShipmentStatus not found');
    }

    status.paymentDate = paymentDate;
    status.amountPaid = amountPaid;
    status.paymentStatus = 'PAID';
    await status.save();

    res.status(200).json({ message: 'Payment approved successfully', status });
  } catch (err) {
    console.error('Error approving payment:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

export const uploadPaymentReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { shipmentStatusId } = req.params;

  try {
    // multer single file under field 'paymentReceipt'
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      throw new CustomError(400, 'No file uploaded');
    }

    const status = await ShipmentStatus.findByPk(shipmentStatusId);
    if (!status) {
      throw new CustomError(404, 'ShipmentStatus not found');
    }

    status.paymentReceipt = file.path;
    status.paymentStatus = 'PENDING'
    const updated = await status.save();

    res.status(200).json({ message: 'Receipt uploaded', status: updated });
  } catch (err) {
    console.error('Error uploading receipt:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};
