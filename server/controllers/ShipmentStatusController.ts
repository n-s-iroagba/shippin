import { Request, Response, NextFunction } from 'express';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { CustomError } from '../CustomError';

const shipmentStatusController = {
  async createStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;

      const shipment = await ShipmentDetails.findOne({ where: { id: shipmentId } });
      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }

      const status = await ShipmentStatus.create({
        ...req.body,
        shipmentDetailsId: shipmentId
      });

      res.status(201).json(status);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId, statusId } = req.params;

      const shipment = await ShipmentDetails.findOne({ where: { id: shipmentId } });
      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }

      const [updated] = await ShipmentStatus.update(req.body, {
        where: { id: statusId, shipmentDetailsId: shipmentId }
      });

      if (!updated) {
        throw new CustomError(404, 'Status not found');
      }

      const status = await ShipmentStatus.findByPk(statusId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  },

  async getShipmentStatusesByShipmentDetailsId(req: Request, res: Response, next: NextFunction) {
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

      res.status(200).json(statuses);
    } catch (error) {
      console.error('Error fetching shipment statuses:', error);
      next(new CustomError(500, 'Internal Server Error'));
    }
  },

  async deleteShipmentStatus(req: Request, res: Response, next: NextFunction) {
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
      next(err instanceof CustomError ? err : new CustomError(500, 'Internal Server Error'));
    }
  },

  async approvePayment(req: Request, res: Response, next: NextFunction) {
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
      next(err instanceof CustomError ? err : new CustomError(500, 'Internal Server Error'));
    }
  },

  async uploadPaymentReceipt(req: Request, res: Response, next: NextFunction) {
    const { shipmentStatusId } = req.params;

    try {
      const file = (req as Request & { file?: Express.Multer.File }).file;
      if (!file) {
        throw new CustomError(400, 'No file uploaded');
      }

      const status = await ShipmentStatus.findByPk(shipmentStatusId);
      if (!status) {
        throw new CustomError(404, 'ShipmentStatus not found');
      }

      status.paymentReceipt = file.path;
      status.paymentStatus = 'PENDING';
      const updated = await status.save();

      res.status(200).json({ message: 'Receipt uploaded', status: updated });
    } catch (err) {
      console.error('Error uploading receipt:', err);
      next(err instanceof CustomError ? err : new CustomError(500, 'Internal Server Error'));
    }
  }
};

export default shipmentStatusController;
