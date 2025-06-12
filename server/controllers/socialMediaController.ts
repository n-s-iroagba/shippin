import { Response } from 'express';
import { SocialMedia } from '../models/SocialMedia';
import { AppError } from '../utils/error/errorClasses';
import { handleError } from '../utils/error/handleError';

import ApiResponse from '../dto/ApiResponse';
import logger from '../utils/logger';
import { validateSocialMediaCreation, validateSocialMediaUpdate } from '../validation/socialMedia.validation';

export const socialMediaController = {
  async list(req: Request, res: Response): Promise<void> {
  try {
       const adminId = req.admin?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: socialMediaLinks } = await SocialMedia.findAndCountAll({
        where: { adminId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset
      });

      logger.info(`Listed ${socialMediaLinks.length} social media links for admin ${adminId}`);
      const response: ApiResponse<SocialMedia[]> = {
        success: true,
        data: socialMediaLinks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / Number(limit))
        }
      };
      res.json(response);
    } catch (error) {
      handleError(error, "list social media links", res);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
  try {
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      // Validate request body
      validateSocialMediaCreation(req.body);

    const { name, url } = req.body;

    const socialMedia = await SocialMedia.create({
      adminId,
      name,
        url
    });

      logger.info(`Social media link created successfully for admin ${adminId}`);
      const response: ApiResponse<SocialMedia> = {
        success: true,
        message: "Social media link created successfully",
        data: socialMedia
      };
      res.status(201).json(response);
  } catch (error) {
      handleError(error, "create social media link", res);
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
        throw new AppError(400, "Valid social media link ID is required");
      }

      // Validate request body
      validateSocialMediaUpdate(req.body);

    const socialMedia = await SocialMedia.findByPk(id);
    if (!socialMedia) {
        throw new AppError(404, "Social media link not found");
    }

      if (socialMedia.adminId !== adminId) {
        throw new AppError(403, "Not authorized to update this social media link");
      }

      await socialMedia.update(req.body);

      const updatedSocialMedia = await SocialMedia.findByPk(id);
      if (!updatedSocialMedia) {
        throw new AppError(404, "Failed to retrieve updated social media link");
      }

      logger.info(`Social media link updated successfully: ${id}`);
      const response: ApiResponse<SocialMedia> = {
        success: true,
        message: "Social media link updated successfully",
        data: updatedSocialMedia
      };
      res.json(response);
  } catch (error) {
      handleError(error, "update social media link", res);
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
        throw new AppError(400, "Valid social media link ID is required");
      }

    const socialMedia = await SocialMedia.findByPk(id);
    if (!socialMedia) {
        throw new AppError(404, "Social media link not found");
      }

      if (socialMedia.adminId !== adminId) {
        throw new AppError(403, "Not authorized to delete this social media link");
    }

    await socialMedia.destroy();

      logger.info(`Social media link deleted successfully: ${id}`);
      const response: ApiResponse<null> = {
        success: true,
        message: "Social media link deleted successfully"
      };
      res.json(response);
  } catch (error) {
      handleError(error, "delete social media link", res);
  }
  }
};
