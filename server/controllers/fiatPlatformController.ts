import { Request, Response } from 'express';
import { FiatPlatform } from '../models/FiatPlatform';
import { CustomError } from '../CustomError';

export const fiatPlatformController = {
  async list(req: Request, res: Response) {
    try {
      const adminId = Number(req.params.adminId);
      if (isNaN(adminId)) throw new CustomError(400, 'Invalid adminId');

      const platforms = await FiatPlatform.findAll({ where: { adminId } });
      res.json(platforms);
    } catch (error: any) {
      console.error('List fiat platforms error:', error);
      res.status(error.status || 500).json({ message: error.message || 'Failed to fetch fiat platforms' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const adminId = Number(req.params.adminId);
      if (isNaN(adminId)) throw new CustomError(400, 'Invalid adminId');

      const { name, baseUrl, messageTemplate } = req.body;

      const errors: Record<string, string> = {};
      if (!name?.trim()) errors.name = 'Name is required';
      if (!baseUrl?.trim()) errors.baseUrl = 'Base URL is required';
      if (!messageTemplate?.trim()) {
        errors.messageTemplate = 'Message template is required';
      } else if (!messageTemplate.includes('{amount}') || !messageTemplate.includes('{statusId}')) {
        errors.messageTemplate = 'Message template must include {amount} and {statusId} placeholders';
      }

      if (Object.keys(errors).length > 0) {
        throw new CustomError(400, 'Invalid input');
      }

      const platform = await FiatPlatform.create({
        adminId,
        name: name.trim(),
        baseUrl: baseUrl.trim(),
        messageTemplate: messageTemplate.trim()
      });

      res.status(201).json(platform);
    } catch (error: any) {
      console.error('Create fiat platform error:', error);
      res.status(error.status || 500).json({ message: error.message || 'Failed to create fiat platform', errors: error.errors });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const adminId = Number(req.params.adminId);
      const { id } = req.params;
      const updates = req.body;

      if (isNaN(adminId)) throw new CustomError(400, 'Invalid adminId');

      const errors: Record<string, string> = {};
      if (updates.name !== undefined && !updates.name.trim()) errors.name = 'Name cannot be empty';
      if (updates.baseUrl !== undefined && !updates.baseUrl.trim()) errors.baseUrl = 'Base URL cannot be empty';
      if (updates.messageTemplate !== undefined && !updates.messageTemplate.trim()) errors.messageTemplate = 'Message template cannot be empty';

      if (Object.keys(errors).length > 0) {
        throw new CustomError(400, 'Invalid input');
      }

      const platform = await FiatPlatform.findByPk(id);
      if (!platform) throw new CustomError(404, 'Fiat platform not found');
      if (platform.adminId !== adminId) throw new CustomError(403, 'Not authorized');

      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'string') {
          updates[key] = updates[key].trim();
        }
      });

      await platform.update(updates);
      res.json(platform);
    } catch (error: any) {
      console.error('Update fiat platform error:', error);
      res.status(error.status || 500).json({ message: error.message || 'Failed to update fiat platform', errors: error.errors });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const adminId = Number(req.params.adminId);
      const { id } = req.params;

      if (isNaN(adminId)) throw new CustomError(400, 'Invalid adminId');

      const platform = await FiatPlatform.findByPk(id);
      if (!platform) throw new CustomError(404, 'Fiat platform not found');
      if (platform.adminId !== adminId) throw new CustomError(403, 'Not authorized');

      await platform.destroy();
      res.json({ message: 'Fiat platform deleted successfully' });
    } catch (error: any) {
      console.error('Delete fiat platform error:', error);
      res.status(error.status || 500).json({ message: error.message || 'Failed to delete fiat platform' });
    }
  }
};
