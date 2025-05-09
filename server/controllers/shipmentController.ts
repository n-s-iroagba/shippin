import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../CustomError';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';

export const shipmentController = {
  async createShipment(req: Request, res: Response, next: NextFunction) {
      console.log('in create shipment')
    try {
      const  id = String( Math.random()*1000000000) + 'WPCFJJ'

      const adminId = req.params.adminId;
      const shipmentData = { ...req.body, adminId,shipmentID:id };

      const shipment = await ShipmentDetails.create(shipmentData);
      res.status(201).json(shipment);
    } catch (error) {
      console.error('error in shipment controller',error)
      res.status(500).json('error occured in shipment controller')
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
      console.error('error in shipment controller',error)
      res.status(500).json('error occured in shipment controller')
    }
  },

  async getShipmentDetails(req: Request, res: Response, next: NextFunction) {
    console.log('in  shipment details')
    try {
      const { id } = req.params;

        const shipment = await ShipmentDetails.findOne({
          where: { id },
          include: [ ShipmentStatus ]   // no `as`
        });
  
      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }
      const statuses = ShipmentStatus.findAll({where:{
        shipmentDetailsId:shipment.id
      }})
      console.log(statuses)

      res.json({shipment,statuses});
    } catch (error) {
      console.error('error in shipment controller',error)
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
      console.error('error in shipment controller',error)
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
      console.error('error in shipment controller',error)
      res.status(500).json('error occured in shipment controller')
    }
  }
};
