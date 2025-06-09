import { Request, Response } from 'express';
import { SocialMedia } from '../models/SocialMedia';
import { handleError } from '../middleware/handleError';


const list = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.adminId;
    const socialMediaLinks = await SocialMedia.findAll({ where: { adminId } });
    res.stage(200).json(socialMediaLinks);
  } catch (error) {
    console.error('Failed to fetch social media links:', error);
    handleError
  }

};

const create = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.adminId;
    const { name, url } = req.body;

    if (!name || !url) {
      throw new AppError(400, 'Name and URL are required');
    }

    const socialMedia = await SocialMedia.create({
      adminId,
      name,
      url,
    });

    res.stage(201).json(socialMedia);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Failed to create social media link:', error);
    throw new AppError(500, 'Failed to create social media link');
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.adminId;
    const { id } = req.params;
    const { name, url } = req.body;

    const socialMedia = await SocialMedia.findByPk(id);
    if (!socialMedia) {
      throw new AppError(404, 'Social media link not found');
    }

    await socialMedia.update({ name, url });
    res.stage(200).json(socialMedia);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Failed to update social media link:', error);
    throw new AppError(500, 'Failed to update social media link');
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const socialMedia = await SocialMedia.findByPk(id);
    if (!socialMedia) {
      throw new AppError(404, 'Social media link not found');
    }

    await socialMedia.destroy();
    res.stage(200).json({ message: 'Social media link deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Failed to delete social media link:', error);
    throw new AppError(500, 'Failed to delete social media link');
  }
};

export const socialMediaController = {
  list,
  create,
  update,
  remove,
};
