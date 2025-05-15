import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../CustomError';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';
import logger from '../utils/logger';

export const shipmentController = {
  async createShipment(req: Request, res: Response, next: NextFunction) {
      console.log('in create shipment')
      console.log(req.body)
    try {
      const  id = String( Math.random()*1000000000) + 'WPCFJJ'

      const adminId = req.params.adminId;
      const shipmentData = { ...req.body, adminId,shipmentID:id };

      const shipment = await ShipmentDetails.create(shipmentData);
      res.status(201).json(shipment);
    } catch (error) {
      logger.error('Error in shipment controller:', { error, operation: 'createShipment' });
      res.status(500).json('error occurred in shipment controller')
    }
  },

  async listShipments(req: Request, res: Response, next: NextFunction) {
    console.log('in list shipment')
    try {
      const adminId = req.params.adminId;
      const shipments = await ShipmentDetails.findAll({
        where: { adminId },
        attributes: ['id', 'shipmentID', 'senderName', 'recipientName', 
                    'receivingAddress', 'freightType', 'expectedTimeOfArrival']
      });
      res.json(shipments);
    } catch (error) {
      logger.error('Error in shipment controller:', { error, operation: 'listShipments' });
      res.status(500).json('error occured in shipment controller')
    }
  },

  async getShipmentDetails(req: Request, res: Response, next: NextFunction) {
    console.log('in  shipment details')
    try {
      const { id } = req.params;

        const shipment = await ShipmentDetails.findByPk(id);

      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }
      console.log(shipment)
      const statuses = await ShipmentStatus.findAll({where:{
        shipmentDetailsId:shipment.id
      }})


      res.json({shipment,statuses});
    } catch (error) {
      logger.error('Error in shipment controller:', { error, operation: 'getShipmentDetails' });
      res.status(500).json('error occured in shipment controller')
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
      logger.error('Error in shipment controller:', { error, operation: 'updateShipment' });
      res.status(500).json('error occured in shipment controller')
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
      logger.error('Error in shipment controller:', { error, operation: 'deleteShipment' });
      res.status(500).json('error occured in shipment controller')
    }
  }
};