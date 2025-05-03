
import { Request, Response } from 'express';
import { DocumentTemplate } from '../models/DocumentTemplate';
import { CustomError } from '../CustomError';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './uploads/templates',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

export const listTemplates = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.adminId);
    const templates = await DocumentTemplate.findAll({ where: { adminId } });
    res.status(200).json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    throw new CustomError(500, 'Failed to fetch document templates');
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.adminId);
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      throw new CustomError(400, 'Invalid input');
    }

    const template = await DocumentTemplate.create({
      adminId,
      name,
      filePath: file.path,
    });

    res.status(201).json(template);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    throw error;
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.adminId);
    const { id } = req.params;
    const { name } = req.body;
    const file = req.file;

    const template = await DocumentTemplate.findByPk(id);
    if (!template) {
      throw new CustomError(404, 'Template not found');
    }

    if (template.adminId !== adminId) {
      throw new CustomError(403, 'Not authorized');
    }

    if (file) {
      await fs.unlink(template.filePath).catch(console.error);
      template.filePath = file.path;
    }

    if (name) {
      template.name = name;
    }

    await template.save();
    res.status(200).json(template);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    throw error;
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.adminId);
    const { id } = req.params;

    const template = await DocumentTemplate.findByPk(id);
    if (!template) {
      throw new CustomError(404, 'Template not found');
    }

    if (template.adminId !== adminId) {
      throw new CustomError(403, 'Not authorized');
    }

    await fs.unlink(template.filePath).catch(console.error);
    await template.destroy();

    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const downloadTemplate = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.adminId);
    const { id } = req.params;

    const template = await DocumentTemplate.findByPk(id);
    if (!template) {
      throw new CustomError(404, 'Template not found');
    }

    if (template.adminId !== adminId) {
      throw new CustomError(403, 'Not authorized');
    }

    res.download(template.filePath);
  } catch (error) {
    throw error;
  }
};
