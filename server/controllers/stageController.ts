import { Response,Request } from 'express';
import { Stage } from '../models/Stage';
import { Shipment } from '../models/Shipment';
import { AppError } from '../utils/error/errorClasses';
import { handleError } from '../utils/error/handleError';

import ApiResponse from '../dto/ApiResponse';
import logger from '../utils/logger';
import { validateStageCreationDto } from '../validation/stage.validation';


export const stageController = {
  async list(req: Request, res: Response): Promise<any> {
    try {
       const adminId = req.admin?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      const offset = (Number(page) - 1) * Number(limit);

      // Get stages through shipments
      const { count, rows: stages } = await Stage.findAndCountAll({
        include: [{
          model: Shipment,
          where: { adminId },
          required: true
        }],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset
      });

      logger.info(`Listed ${stages.length} stages for admin ${adminId}`);
      const response: ApiResponse<Stage[]> = {
        success: true,
        data: stages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / Number(limit))
        }
      };
      return res.status(200).json(response);
    } catch (error) {
      handleError(error, "list stages", res);
    }
  },

  async create(req:Request, res: Response): Promise<any> {
    try {
       const adminId = req.admin?.id;
      const { shipmentId } = req.body;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      // Check if shipment exists and belongs to admin
      const shipment = await Shipment.findOne({
        where: { id: shipmentId, adminId }
      });

      if (!shipment) {
        throw new AppError(404, "Shipment not found or not authorized");
      }

      // Validate request body
      validateStageCreationDto(req.body);

      const stage = await Stage.create(req.body);

      logger.info(`Stage created successfully for shipment ${shipmentId}`);
      const response: ApiResponse<Stage> = {
        success: true,
        message: "Stage created successfully",
        data: stage
      };
      res.status(201).json(response);
    } catch (error) {
      handleError(error, "create stage", res);
    }
  },

  async update(req:Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid stage ID is required");
      }

    

      const stage = await Stage.findByPk(id, {
        include: [{
          model: Shipment,
          required: true
        }]
      });

      if (!stage) {
        throw new AppError(404, "Stage not found");
      }

      if (!stage.shipment) {
        throw new AppError(404, "Associated shipment not found");
      }

      if (stage.shipment.adminId !== adminId) {
        throw new AppError(403, "Not authorized to update this stage");
      }

      await stage.update(req.body);

      const updatedStage = await Stage.findByPk(id);
      if (!updatedStage) {
        throw new AppError(404, "Failed to retrieve updated stage");
      }

      logger.info(`Stage updated successfully: ${id}`);
      const response: ApiResponse<Stage> = {
        success: true,
        message: "Stage updated successfully",
        data: updatedStage
      };
      return res.status(200).json(response);
    } catch (error) {
      handleError(error, "update stage", res);
    }
  },

  async remove(req:Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid stage ID is required");
      }

      const stage = await Stage.findByPk(id, {
        include: [{
          model: Shipment,
          required: true
        }]
      });

      if (!stage) {
        throw new AppError(404, "Stage not found");
      }

      if (!stage.shipment) {
        throw new AppError(404, "Associated shipment not found");
      }

      if (stage.shipment.adminId !== adminId) {
        throw new AppError(403, "Not authorized to delete this stage");
      }

      await stage.destroy();

      logger.info(`Stage deleted successfully: ${id}`);
      const response: ApiResponse<null> = {
        success: true,
        message: "Stage deleted successfully"
      };
      return res.status(200).json(response);
    } catch (error) {
      handleError(error, "delete stage", res);
    }
  },

  async verifyPayment(req:Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;
      const { paymentStatus } = req.body;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid stage ID is required");
      }

      if (!paymentStatus || !['UNPAID', 'PARTIALLY_PAID', 'PAID'].includes(paymentStatus)) {
        throw new AppError(400, "Valid payment status is required");
      }

      const stage = await Stage.findByPk(id, {
        include: [{
          model: Shipment,
          required: true
        }]
      });

      if (!stage) {
        throw new AppError(404, "Stage not found");
      }

      if (!stage.shipment) {
        throw new AppError(404, "Associated shipment not found");
      }

      if (stage.shipment.adminId !== adminId) {
        throw new AppError(403, "Not authorized to verify this stage");
      }

      // Only admin can update payment status
      await stage.update({
        paymentStatus,
      });

      const updatedStage = await Stage.findByPk(id);
      if (!updatedStage) {
        throw new AppError(404, "Failed to retrieve updated stage");
      }

      logger.info(`Stage payment status updated: ${id}`);
      const response: ApiResponse<Stage> = {
        success: true,
        message: "Payment status updated successfully",
        data: updatedStage
      };
      return res.status(200).json(response);
    } catch (error) {
      handleError(error, "verify payment", res);
    }
  },

  async getPaymentReceipts(req:Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid stage ID is required");
      }

      const stage = await Stage.findByPk(id, {
        include: [{
          model: Shipment,
          required: true
        }]
      });

      if (!stage) {
        throw new AppError(404, "Stage not found");
      }

      if (!stage.shipment) {
        throw new AppError(404, "Associated shipment not found");
      }

      if (stage.shipment.adminId !== adminId) {
        throw new AppError(403, "Not authorized to view this stage's receipts");
      }

      if (!stage.paymentReceipts || stage.paymentReceipts.length === 0) {
        throw new AppError(404, "No payment receipts found");
      }

      // Return the receipts as base64 strings
      const receipts = stage.paymentReceipts.map(receipt => receipt.toString('base64'));

      const response: ApiResponse<string[]> = {
        success: true,
        data: receipts
      };
      return res.status(200).json(response);
    } catch (error) {
      handleError(error, "get payment receipts", res);
    }
  },

  async uploadReceipt(req:Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
       const adminId = req.admin?.id;
      const file = req.file;

      if (!adminId) {
        throw new AppError(400, "Valid admin ID is required");
      }

      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid stage ID is required");
      }

      if (!file) {
        throw new AppError(400, "Payment receipt file is required");
      }

      const stage = await Stage.findByPk(id, {
        include: [{
          model: Shipment,
          required: true
        }]
      });

      if (!stage) {
        throw new AppError(404, "Stage not found");
      }

      if (!stage.shipment) {
        throw new AppError(404, "Associated shipment not found");
      }

      if (stage.shipment.adminId !== adminId) {
        throw new AppError(403, "Not authorized to upload receipt for this stage");
      }

      // Add the new receipt to the existing receipts array
      const updatedReceipts = [...(stage.paymentReceipts || []), file.buffer];

      // Update the stage with the new receipt and set payment status to PENDING
      await stage.update({
        paymentReceipts: updatedReceipts,
        paymentStatus: 'PENDING'
      });

      const updatedStage = await Stage.findByPk(id);
      if (!updatedStage) {
        throw new AppError(404, "Failed to retrieve updated stage");
      }

      logger.info(`Payment receipt uploaded for stage: ${id}`);
      const response: ApiResponse<Stage> = {
        success: true,
        message: "Payment receipt uploaded successfully",
        data: updatedStage
      };
      return res.status(200).json(response);
    } catch (error) {
      handleError(error, "upload receipt", res);
    }
  }
};
