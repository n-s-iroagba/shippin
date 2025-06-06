import { Request, Response, NextFunction } from 'express';
import { ShippingStage } from '../models/ShippingStage';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { CustomError } from '../CustomError';
import logger from '../utils/logger';

const shippingStageController = {
  async createStatus(req: Request, res: Response, next: NextFunction):Promise<any> {
    console.log('path',req.file?.path)
    console.log('about creating shipment status')
    try {
      const { shipmentId } = req.params; 
      console.log(Number(shipmentId))
      const file = (req as any).file;
      const data = { ...req.body };
      console.log('file path',file.path)
      
      if (file) {
        data.supportingDocument = file.path;
      }

      const shipment = await ShipmentDetails.findOne({ where: { id: shipmentId } });
      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }
      const status = await ShippingStage.create({
     ...req.body,
        shipmentDetailsId: Number(shipmentId),
      });
      res.status(201).json(status);
    } catch (error) {
      logger.error('Error creating shipment status:', { error, shipmentId: req.params.shipmentId });
      return res.status(500).json('error in shippingStage')
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const { statusId } = req.params;
      const file = (req as any).file;
      const data = { ...req.body };

      // Find the status first
      const status = await ShippingStage.findByPk(statusId);
      if (!status) {
        throw new CustomError(404, 'Status not found');
      }

      // Handle file upload if present
      if (file) {
        data.supportingDocument = file.path;
      }

      // Update the status with validated data
      await status.update({
        title: data.title,
        carrierNote: data.carrierNote,
        dateAndTime: data.dateAndTime,
        requiresFee: data.requiresFee,
        feeInDollars: data.requiresFee ? data.feeInDollars : null,
        supportingDocument: data.supportingDocument || status.supportingDocument
      });

      // Fetch updated status with associations
      const updatedStatus = await ShippingStage.findByPk(statusId);
      res.json(updatedStatus);
    } catch (error) {
      console.error('Error updating shipment status:', error);
      if (error instanceof CustomError) {
        return res.status(500).json({ message: error.message });
      }
      console.error(error)
      return res.status(500).json({ message: 'Error updating shipment status' });
    }
  },

  async getShippingStageesByShipmentDetailsId(req: Request, res: Response, next: NextFunction):Promise<any> {
    const { shipmentDetailsId } = req.params;

    try {
      const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
      if (!shipment) {
        throw new CustomError(404, 'ShipmentDetails not found');
      }

      const statuses = await ShippingStage.findAll({
        where: { shipmentDetailsId: shipment.id },
        order: [['dateAndTime', 'ASC']],
      });

      res.status(200).json(statuses);
    } catch (error) {
      console.error('Error fetching shipment statuses:', error);

      return res.status(500).json('error in shippingStage')
    }
  },

  async deleteShippingStage(req: Request, res: Response, next: NextFunction):Promise<any> {
    const { shippingStageId } = req.params;

    try {
      const status = await ShippingStage.findByPk(shippingStageId);
      if (!status) {
        throw new CustomError(404, 'ShippingStage not found');
      }

      await status.destroy();
      res.status(200).json({ message: 'ShippingStage deleted successfully' });
    } catch (err) {
      console.error('Error deleting ShippingStage:', err);
      return res.status(500).json('error deleting shipment status')
    }
  },

  async uploadReceipt(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const { id } = req.params;
      const file = (req as any).file;

      if (!file) {
        throw new CustomError(400, 'No receipt file uploaded');
      }

      const status = await ShippingStage.findByPk(id);
      if (!status) {
        throw new CustomError(404, 'Status not found');
      }

      await status.update({
        paymentReceipt: file.path,
        paymentStatus: 'PENDING'
      });

      res.json({ message: 'Receipt uploaded successfully' });
    } catch (error) {
      console.error('Receipt upload error:', error);
      if (error instanceof CustomError) throw error;
      throw new CustomError(500, 'Failed to upload receipt');
    }
  },

  async approvePayment(req: Request, res: Response, next: NextFunction):Promise<any> {
  
      const { shippingStageId } = req.params;
    const { paymentDate, amountPaid } = req.body;

    try {
      const status = await ShippingStage.findByPk(shippingStageId);
      if (!status) {
        throw new CustomError(404, 'ShippingStage not found');
      }

      status.paymentDate = paymentDate;
      status.amountPaid = amountPaid;
      status.paymentStatus = 'PAID';
      await status.save();

      res.status(200).json({ message: 'Payment approved successfully', status });
    } catch (err) {
      console.error('Error approving payment:', err);
       return res.status(500).json({ message: 'Error updating approving payment' });
    }
  }

}

export default shippingStageController;