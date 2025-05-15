// controllers/shipmentWalletController.ts
import { Request, Response, NextFunction, Router } from 'express';

import { CustomError } from '../CustomError';
import ShipmentWallet from '../models/ShipmentWallet';

// Create a new wallet record
export const createWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { coinName, walletAddress, adminId } = req.body;
  try {
    if (!coinName || !walletAddress || !adminId) {
      throw new CustomError(400, 'coinName, walletAddress, and adminId are required');
    }
    const wallet = await ShipmentWallet.create({ coinName, walletAddress, adminId });
    res.status(201).json(wallet);
  } catch (err) {
    console.error('Error creating wallet:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

// Fetch all wallets for a specific admin
export const getWalletsByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const adminId = Number(req.params.adminId);
  try {
    if (isNaN(adminId)) {
      throw new CustomError(400, 'Invalid adminId parameter');
    }
    const wallets = await ShipmentWallet.findAll({ where: { adminId } });
    res.status(200).json(wallets);
  } catch (err) {
    console.error('Error fetching wallets by admin:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

// Fetch all wallets by coinName
export const getWalletsByCoinName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const coinName = req.params.coinName;
  try {
    if (!coinName) {
      throw new CustomError(400, 'coinName parameter is required');
    }
    const wallets = await ShipmentWallet.findAll({ where: { coinName } });
    res.status(200).json(wallets);
  } catch (err) {
    console.error('Error fetching wallets by coinName:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

// Update a wallet by its id
export const updateWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  const { coinName, walletAddress } = req.body;
  try {
    const wallet = await ShipmentWallet.findByPk(id);
    if (!wallet) {
      throw new CustomError(404, 'Wallet not found');
    }
    if (coinName !== undefined) wallet.coinName = coinName;
    if (walletAddress !== undefined) wallet.walletAddress = walletAddress;
    await wallet.save();
    res.status(200).json(wallet);
  } catch (err) {
    console.error('Error updating wallet:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

// Delete a wallet by its id
export const deleteWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  try {
    const wallet = await ShipmentWallet.findByPk(id);
    if (!wallet) {
      throw new CustomError(404, 'Wallet not found');
    }
    await wallet.destroy();
    res.status(200).json({ message: 'Wallet deleted successfully' });
  } catch (err) {
    console.error('Error deleting wallet:', err);
    if (err instanceof CustomError) return next(err);
    next(new CustomError(500, 'Internal Server Error'));
  }
};

