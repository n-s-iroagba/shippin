
import { Request, Response, NextFunction } from 'express';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { Admin } from '../models/Admin';
import { CustomError } from '../CustomError';
import { sendEmail } from '../mailService';

export const trackingController = {
  async trackShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingId } = req.params;
      const { lat, lng } = req.query;

      if (!trackingId) {
        throw new CustomError('Tracking ID is required', 400);
      }

      const shipmentDetails = await ShipmentDetails.findOne({
        where: { shipmentID: trackingId },
        include: [{
          model: ShipmentStatus,
          order: [['dateAndTime', 'ASC']]
        }]
      });

      if (!shipmentDetails) {
        throw new CustomError('Tracking ID not found', 404);
      }

      const admin = await Admin.findByPk(shipmentDetails.adminId);
      
      if (admin && admin.email) {
        try {
          await sendEmail(admin.email, 'Shipment Tracked', {
            senderName: shipmentDetails.senderName,
            recipientName: shipmentDetails.recipientName,
            receivingAddress: shipmentDetails.receivingAddress,
            shipmentID: shipmentDetails.shipmentID,
            location: { lat, lng }
          });
        } catch (error) {
          console.error('Failed to send email:', error);
          // Continue execution as per spec
        }
      }

      res.json({
        shipmentDetails,
        shipmentStatuses: shipmentDetails.ShipmentStatus
      });
    } catch (error) {
      console.error('Tracking error:', error);
      if (error instanceof CustomError && error.message === 'Tracking ID not found') {
        next(error);
      } else {
        next(new CustomError('Failed to load tracking data', 500));
      }
    }
  }
};
