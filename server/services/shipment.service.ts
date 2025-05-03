
import { ShipmentDetails } from '../models/ShipmentDetails';
import { CustomError } from '../CustomError';

export class ShipmentService {
  async createShipment(shipmentData: any, adminId: number) {
    const trackingNumber = this.generateTrackingNumber();
    return ShipmentDetails.create({
      ...shipmentData,
      shipmentID: trackingNumber,
      adminId
    });
  }

  async getShipmentsByAdmin(adminId: number) {
    return ShipmentDetails.findAll({
      where: { adminId },
      attributes: [
        'id',
        'shipmentID',
        'senderName',
        'receivingAddress',
        'recipientName',
        'freightType',
        'expectedTimeOfArrival'
      ]
    });
  }

  async getShipmentDetails(id: string, adminId: number) {
    const shipment = await ShipmentDetails.findOne({
      where: { id, adminId },
      include: ['shipmentStatus']
    });

    if (!shipment) {
      throw new CustomError(404, 'Shipment not found');
    }

    return shipment;
  }

  private generateTrackingNumber(): string {
    return 'SHP' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
  }
}
