
import { Request, Response } from 'express';
import { CryptoWallet } from '../models/CryptoWallet';
import { CustomError } from '../CustomError';

export const cryptoWalletController = {
  async list(req: Request, res: Response) {
    try {
      const adminId = req.admin?.id;
      const wallets = await CryptoWallet.findAll({ where: { adminId } });
      res.json(wallets);
    } catch (error) {
      console.error('Failed to fetch crypto wallets:', error);
      throw new CustomError('Failed to fetch crypto wallets', 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const adminId = req.admin?.id;
      const { currency, walletAddress, label } = req.body;

      if (!currency || !walletAddress) {
        throw new CustomError('Invalid input', 400);
      }

      const wallet = await CryptoWallet.create({
        adminId,
        currency,
        walletAddress,
        label
      });

      res.status(201).json(wallet);
    } catch (error) {
      console.error('Failed to create crypto wallet:', error);
      if (error instanceof CustomError) throw error;
      throw new CustomError('Failed to create crypto wallet', 500);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.admin?.id;
      const updates = req.body;

      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) throw new CustomError('Crypto wallet not found', 404);
      if (wallet.adminId !== adminId) throw new CustomError('Not authorized', 403);

      await wallet.update(updates);
      res.json(wallet);
    } catch (error) {
      console.error('Failed to update crypto wallet:', error);
      if (error instanceof CustomError) throw error;
      throw new CustomError('Failed to update crypto wallet', 500);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.admin?.id;

      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) throw new CustomError('Crypto wallet not found', 404);
      if (wallet.adminId !== adminId) throw new CustomError('Not authorized', 403);

      await wallet.destroy();
      res.json({ message: 'Crypto wallet deleted successfully' });
    } catch (error) {
      console.error('Failed to delete crypto wallet:', error);
      if (error instanceof CustomError) throw error;
      throw new CustomError('Failed to delete crypto wallet', 500);
    }
  }
};
