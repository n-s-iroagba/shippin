import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../CustomError';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';

export const shipmentController = {
  async createShipment(req: Request, res: Response, next: NextFunction) {
    try {
   
      const adminId = req.params.adminId;
      const shipmentData = { ...req.body, adminId };

      const shipment = await ShipmentDetails.create(shipmentData);
      res.status(201).json(shipment);
    } catch (error) {
      next(error);
    }
  },

  async listShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.params.adminId;
      const shipments = await ShipmentDetails.findAll({
        where: { adminId },
        attributes: ['id', 'shipmentID', 'senderName', 'recipientName', 
                    'receivingAddress', 'freightType', 'expectedTimeOfArrival']
      });
      res.json(shipments);
    } catch (error) {
      next(error);
    }
  },

  async getShipmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
  

      const shipment = await ShipmentDetails.findOne({
        where: { id},
        include: [{
          model: ShipmentStatus,
          as: 'statusHistory'
        }]
      });

      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }

      res.json(shipment);
    } catch (error) {
      next(error);
    }
  },

  async updateShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
    

      const [updated] = await ShipmentDetails.update(req.body, {
        where: { id}
      });

      if (!updated) {
        throw new CustomError(404, 'Shipment not found');
      }

      const shipment = await ShipmentDetails.findOne({
        where: { id}
      });

      res.json(shipment);
    } catch (error) {
      next(error);
    }
  },

  async deleteShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
     

      const deleted = await ShipmentDetails.destroy({
        where: { id}
      });

      if (!deleted) {
        throw new CustomError(404, 'Shipment not found');
      }

      await ShipmentStatus.destroy({
        where: { shipmentDetailsId: id }
      });

      res.json({ message: 'Shipment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
