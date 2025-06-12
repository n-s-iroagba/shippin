import { Response,Request } from 'express';
import { CryptoWallet } from '../models/CryptoWallet';
import { AppError } from '../utils/error/errorClasses';
import { handleError } from '../utils/error/handleError';

import ApiResponse from '../dto/ApiResponse';
import logger from '../utils/logger';
import { validateCryptoWalletCreation, validateCryptoWalletUpdate } from '../validation/cryptoWallet.validation';

export const cryptoWalletController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
       const adminId = req.admin?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: wallets } = await CryptoWallet.findAndCountAll({
        where: { adminId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset
      });

      logger.info(`Listed ${wallets.length} crypto wallets for admin ${adminId}`);
      const response: ApiResponse<CryptoWallet[]> = {
        success: true,
        data: wallets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / Number(limit))
        }
      };
      res.json(response);
    } catch (error) {
      handleError(error, "list crypto wallets", res);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      // Validate request body
      validateCryptoWalletCreation(req.body);

      const { currency, walletAddress } = req.body;

      const wallet = await CryptoWallet.create({
        adminId,
        currency,
        walletAddress
      });

      logger.info(`Crypto wallet created successfully for admin ${adminId}`);
      const response: ApiResponse<CryptoWallet> = {
        success: true,
        message: "Crypto wallet created successfully",
        data: wallet
      };
      res.status(201).json(response);
    } catch (error) {
      handleError(error, "create crypto wallet", res);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid wallet ID is required");
      }

      // Validate request body
      validateCryptoWalletUpdate(req.body);

      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) {
        throw new AppError(404, "Crypto wallet not found");
      }

      if (wallet.adminId !== adminId) {
        throw new AppError(403, "Not authorized to update this wallet");
      }

      await wallet.update(req.body);

      const updatedWallet = await CryptoWallet.findByPk(id);
      if (!updatedWallet) {
        throw new AppError(404, "Failed to retrieve updated wallet");
      }

      logger.info(`Crypto wallet updated successfully: ${id}`);
      const response: ApiResponse<CryptoWallet> = {
        success: true,
        message: "Crypto wallet updated successfully",
        data: updatedWallet
      };
      res.json(response);
    } catch (error) {
      handleError(error, "update crypto wallet", res);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid wallet ID is required");
      }

      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) {
        throw new AppError(404, "Crypto wallet not found");
      }

      if (wallet.adminId !== adminId) {
        throw new AppError(403, "Not authorized to delete this wallet");
      }

      await wallet.destroy();

      logger.info(`Crypto wallet deleted successfully: ${id}`);
      const response: ApiResponse<null> = {
        success: true,
        message: "Crypto wallet deleted successfully"
      };
      res.json(response);
    } catch (error) {
      handleError(error, "delete crypto wallet", res);
    }
  }
};
