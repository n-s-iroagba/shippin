import { Request, Response } from 'express';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { ShipmentWallet } from '../models/ShipmentWallet';
import { sendCustom } from '../mailService';
import { Op } from 'sequelize';
import { CustomError } from '../CustomError';

const generateTrackingNumber = () => {
  return 'SHP' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

export const createShipment = async (req: Request, res: Response) => {
  try {
    const { receiverName, receiverEmail, origin, destination, notes,senderName,sendingPickupPoint,
      shippingTakeoffAddress,
      expectedTimeOfArrival,
      freightType,
      kg,
      dimensionInInches, } = req.body;
    const adminId = Number(req.params.id);

    if (!adminId) {
      return res.status(403).json({ error: 'Admin authentication required' });
    }

    if (!receiverName || !receiverEmail || !origin || !destination) {
      throw new CustomError(400,'Missing required shipment details' );
    }
    const trackingNumber = generateTrackingNumber();

    const shipment = await ShipmentDetails.create({
      shipmentID: trackingNumber,
      senderName,
      recipientName: receiverName,
      receipientEmail: receiverEmail,
      receivingAddress: destination,
      shipmentDescription: notes,
      adminId,
      sendingPickupPoint,
      shippingTakeoffAddress,
      expectedTimeOfArrival,
      freightType,
      kg,
      dimensionInInches,
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment' });
  }
};


export const updateShipment = async (
  req: Request,
  res: Response,

): Promise<void> => {
  const { shipmentDetailsId } = req.params;
  const updateData = req.body;

  try {
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
    if (!shipment) {
      throw new CustomError(404, 'Shipment not found');
    }

    await shipment.update(updateData);
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
};



export const getShipmentByTrackingNumber = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { shipmentID } = req.params;

  try {
    const shipment = await ShipmentDetails.findOne({
      where: { shipmentID },
    });

    if (!shipment) {
      throw new CustomError(404, 'Shipment not found');
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ error: 'get shipment by tracking number' });
  }
};

export const getShipmentByAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { adminId } = req.params;

  try {
    const shipment = await ShipmentDetails.findOne({
      where: { adminId },
    });

    if (!shipment) {
      throw new CustomError(404, 'Shipment not found');
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ error: 'get shipment by tracking number' });
  }
};

export const deleteShipment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { shipmentDetailsId } = req.params;

  try {
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
    if (!shipment) {
      throw new CustomError(404, 'Shipment not found');
    }

    await shipment.destroy();
    res.status(200).json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({ error: 'shipment deleted successfully'})
  }
};
