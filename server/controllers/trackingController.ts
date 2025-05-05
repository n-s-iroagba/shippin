import { Request, Response, NextFunction } from 'express';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { Admin } from '../models/Admin';
import { CustomError } from '../CustomError';
import { sendCustomMail} from '../mailService';

export const trackingController = {
  async trackShipment(req: Request, res: Response, next: NextFunction) {
    console.log('in tracking function')
    try {
      const { trackingId } = req.params;
      const { lat, lng } = req.query;

      if (!trackingId) {
        throw new CustomError(400, 'Tracking ID is required');
      }

      const shipmentDetails = await ShipmentDetails.findOne({
        where: { shipmentID: trackingId },
        include: [{
          model: ShipmentStatus,
          order: [['dateAndTime', 'ASC']]
        }]
      });

      if (!shipmentDetails) {
        throw new CustomError(404, 'Tracking ID not found');
      }
      const statuses = ShipmentStatus.findAll({where:{
        shipmentDetailsId:shipmentDetails.id
      }})

      const admin = await Admin.findByPk(shipmentDetails.adminId);
      
      if (admin && admin.email) {
        try {
          await sendCustomMail(admin.email, {subject:'Shipment Tracked', 
            senderName: shipmentDetails.senderName,
            recipientName: shipmentDetails.recipientName,
            receivingAddress: shipmentDetails.receivingAddress,
            shipmentID: shipmentDetails.shipmentID,
            loction: { lat, lng }
          
          });
        } catch (error) {
          console.error('Failed to send email:', error);
        }
      }


      res.json({
        shipmentDetails,
        shipmentStatuses: statuses
      });
    } catch (error) {
      console.error('Tracking error:', error);
      if (error instanceof CustomError && error.message === 'Tracking ID not found') {
        next(error);
      } else {
        next(new CustomError(500, 'Failed to load tracking data'));
      }
    }
  }
};
