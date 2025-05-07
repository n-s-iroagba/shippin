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
      console.log(shipment)
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
      console.log('shipments',shipments)
      res.status(200).json({shipments:shipments});
    } catch (error) {
      console.error('error in shipment controller',error)
      res.status(500).json('error occured in shipment controller')
    }
  },

  async getShipmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const shipment = await ShipmentDetails.findOne({
        where: { id },
        include: [{
          model: ShipmentStatus,
          attributes: [
            'id', 'title', 'carrierNote', 'dateAndTime', 
            'feeInDollars', 'paymentStatus', 'requiresFee',
            'paymentReceipt', 'amountPaid', 'paymentDate',
            'percentageNote', 'supportingDocument'
          ],
          order: [['dateAndTime', 'ASC']]
        }]
      });

      if (!shipment) {
        throw new CustomError(404, 'Shipment not found');
      }
      const statuses = await ShipmentStatus.findAll({where:{
        shipmentDetailsId:shipment.id
      }})
      console.log(shipment)

      res.json({shipment:shipment,statuses:statuses});
    } catch (error) {
      console.error('Error in getShipmentDetails:', error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch shipment details' });
      }
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
