import { Response } from 'express';
import { DocumentTemplate } from '../models/DocumentTemplate';
import { AppError } from '../utils/error/errorClasses';
import { handleError } from '../utils/error/handleError';

import ApiResponse from '../dto/ApiResponse';
import logger from '../utils/logger';
import { validateDocumentTemplateCreation, validateDocumentTemplateUpdate } from '../validation/documentTemplate.validation';

export const documentTemplateController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
       const adminId = req.admin?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: templates } = await DocumentTemplate.findAndCountAll({
        where: { adminId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset
      });

      logger.info(`Listed ${templates.length} document templates for admin ${adminId}`);
      const response: ApiResponse<DocumentTemplate[]> = {
        success: true,
        data: templates,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / Number(limit))
        }
      };
      res.json(response);
    } catch (error) {
      handleError(error, "list document templates", res);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      // Validate request body
      validateDocumentTemplateCreation(req.body);

      const template = await DocumentTemplate.create({
        ...req.body,
        adminId
      });

      logger.info(`Document template created successfully for admin ${adminId}`);
      const response: ApiResponse<DocumentTemplate> = {
        success: true,
        message: "Document template created successfully",
        data: template
      };
      res.status(201).json(response);
    } catch (error) {
      handleError(error, "create document template", res);
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
        throw new AppError(400, "Valid document template ID is required");
      }

      // Validate request body
      validateDocumentTemplateUpdate(req.body);

      const template = await DocumentTemplate.findByPk(id);
      if (!template) {
        throw new AppError(404, "Document template not found");
      }

      if (template.adminId !== adminId) {
        throw new AppError(403, "Not authorized to update this document template");
      }

      await template.update(req.body);

      const updatedTemplate = await DocumentTemplate.findByPk(id);
      if (!updatedTemplate) {
        throw new AppError(404, "Failed to retrieve updated document template");
      }

      logger.info(`Document template updated successfully: ${id}`);
      const response: ApiResponse<DocumentTemplate> = {
        success: true,
        message: "Document template updated successfully",
        data: updatedTemplate
      };
      res.json(response);
    } catch (error) {
      handleError(error, "update document template", res);
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
        throw new AppError(400, "Valid document template ID is required");
      }

      const template = await DocumentTemplate.findByPk(id);
      if (!template) {
        throw new AppError(404, "Document template not found");
      }

      if (template.adminId !== adminId) {
        throw new AppError(403, "Not authorized to delete this document template");
      }

      await template.destroy();

      logger.info(`Document template deleted successfully: ${id}`);
      const response: ApiResponse<null> = {
        success: true,
        message: "Document template deleted successfully"
      };
      res.json(response);
    } catch (error) {
      handleError(error, "delete document template", res);
    }
  }
};