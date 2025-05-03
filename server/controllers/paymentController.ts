
import { Request, Response } from 'express';
import { ShipmentStatus } from '../models/ShipmentStatus';
import { CryptoWallet } from '../models/CryptoWallet';
import { FiatPlatform } from '../models/FiatPlatform';
import { CustomError } from '../CustomError';

export const getPaymentInit = async (req: Request, res: Response) => {
  try {
    const { statusId } = req.params;
    
    const shipmentStatus = await ShipmentStatus.findByPk(statusId);
    if (!shipmentStatus) {
      throw new CustomError(404, 'Status not found');
    }

    if (!shipmentStatus.requiresFee || shipmentStatus.paymentStatus !== 'YET_TO_BE_PAID') {
      throw new CustomError(400, 'Payment not required');
    }

    const [cryptoWallets, fiatPlatforms] = await Promise.all([
      CryptoWallet.findAll(),
      FiatPlatform.findAll()
    ]);

    res.status(200).json({
      shipmentStatus: {
        id: shipmentStatus.id,
        feeInDollars: shipmentStatus.feeInDollars,
        title: shipmentStatus.title
      },
      cryptoWallets,
      fiatPlatforms
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    if (error instanceof CustomError) throw error;
    throw new CustomError(500, 'Failed to initialize payment');
  }
};
