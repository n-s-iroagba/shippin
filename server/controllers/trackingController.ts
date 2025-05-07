import { Request, Response, NextFunction } from 'express';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { Admin } from '../models/Admin';
import { CustomError } from '../CustomError';
import { sendCustomMail} from '../mailService';

export const trackingController = {
  async trackShipment(req: Request, res: Response, next: NextFunction):Promise<any> {
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
          attributes: ['id', 'title', 'carrierNote', 'dateAndTime', 'feeInDollars', 'paymentStatus', 'requiresFee', 'supportingDocument'],
          order: [['dateAndTime', 'ASC']]
        }]
      });

      if (!shipmentDetails) {
        throw new CustomError(404, 'Tracking ID not found');
      }
      const statuses = await ShipmentStatus.findAll({where:{
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
            location: { lat, lng }})
          
          }catch(error){
            throw error
          }
        }
      console.log(statuses)
        return res.status(200).json({shipment:shipmentDetails, statuses:statuses})
        } catch (error) {
          console.error('Failed to send email:', error);
          res.status(500).json({message:'error in tracking shipment controller'})
        }
      }
}
