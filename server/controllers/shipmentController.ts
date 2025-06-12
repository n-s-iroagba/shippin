import type { Request, Response } from "express"
import { Stage } from "../models/Stage"
import { Admin } from "../models/Admin"
import { AppError } from "../utils/error/errorClasses"
import logger from "../utils/logger"
import Shipment from "../models/Shipment"
import ApiResponse from "../dto/ApiResponse"
import { handleError } from "../utils/error/handleError"
import { validateShipmentCreationDto, validateShipmentUpdateData} from "../validation/shipment.validation"
import { generateTrackingId } from "../utils/helpers"



export const shipmentController = {
  async createShipment(req: Request, res: Response): Promise<any> {
    try {
       const adminId = req.admin?.id;


      if (!adminId ) { 
        throw new AppError(400, "Valid admin ID is required")
      }

      validateShipmentCreationDto(req.body)


      const adminExists = await Admin.findByPk(Number(adminId))
      if (!adminExists) {
        throw new AppError(404, "Admin not found")
      }

      const trackingId = generateTrackingId()

      const shipmentData = {
        ...req.body,
        adminId: Number(adminId),
        shipmentID: trackingId,
        expectedTimeOfArrival: new Date(req.body.expectedTimeOfArrival),
        receptionDate: req.body.receptionDate ? new Date(req.body.receptionDate) : null,
      }

      const shipment = await Shipment.create(shipmentData);

      logger.info(`Shipment created successfully: ${trackingId}`);
      const response: ApiResponse<Shipment> = {
        success: true,
        message: "Shipment created successfully",
        data: shipment
      };
      return res.status(201).json(response);
    } catch (error) {
      handleError(error, "create shipment", res);
    }
  },

  async listShipments(req: Request, res: Response): Promise<any> {
    try {
       const adminId = req.admin?.id;
      const { page = 1, limit = 10, status, freightType } = req.query

      // Validate adminId parameter
      if (!adminId ) {
        throw new AppError(400, "Valid admin ID is required")
      }

      // Check if admin exists
      const adminExists = await Admin.findByPk(Number(adminId))
      if (!adminExists) {
        throw new AppError(404, "Admin not found")
      }

      // Build where clause
      const whereClause: any = { adminId: Number(adminId) }
      if (status) whereClause.status = status
      if (freightType) whereClause.freightType = freightType

      // Pagination
      const offset = (Number(page) - 1) * Number(limit)

      const { count, rows: shipments } = await Shipment.findAndCountAll({
        where: whereClause,
        attributes: [
          "id",
          "shipmentID",
          "senderName",
          "recipientName",
          "origin",
          "destination",
          "freightType",
          "status",
          "expectedTimeOfArrival",
          "createdAt",
          "updatedAt",
        ],
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset,
      })

      logger.info(`Listed ${shipments.length} shipments for admin ${adminId}`);
      const response: ApiResponse<Shipment[]> = {
        success: true,
        data: shipments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / Number(limit))
        }
      };
      res.json(response);
    } catch (error) {
      handleError(error, "list shipments", res);
    }
  },

  async getShipment(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params

      // Validate id parameter
      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid shipment ID is required")
      }

      const shipment = await Shipment.findByPk(Number(id), {
        include: [
          {
            model: Stage,
            as: "Stages",
            order: [["createdAt", "DESC"]],
          },
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "email", "name"],
          },
        ],
      })

      if (!shipment) {
        throw new AppError(404, "Shipment not found")
      }


      logger.info(`Retrieved shipment details for ID: ${id}`);
      const response: ApiResponse<Shipment> = {
        success: true,
        data: shipment
      };
      res.json(response);
    } catch (error) {
      handleError(error, "get shipment", res);
    }
  },

  async updateShipment(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params

      // Validate id parameter
      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid shipment ID is required")
      }


      validateShipmentUpdateData(req.body)


      // Check if shipment exists
      const existingShipment = await Shipment.findByPk(Number(id))
      if (!existingShipment) {
        throw new AppError(404, "Shipment not found")
      }

      // Prepare update data
      const updateData = { ...req.body }
      if (req.body.expectedTimeOfArrival) {
        updateData.expectedTimeOfArrival = new Date(req.body.expectedTimeOfArrival)
      }
      if (req.body.receptionDate) {
        updateData.receptionDate = new Date(req.body.receptionDate)
      }
      const [affectedCount] = await Shipment.update(updateData, {
        where: { id: Number(id) },
      });

      if (affectedCount === 0) {
        throw new AppError(500, "Failed to update shipment");
      }

      const updatedShipment = await Shipment.findByPk(Number(id), {
        include: [
          { model: Stage, as: "Stages", order: [["createdAt", "DESC"]] },
          { model: Admin, as: "admin", attributes: ["id", "email", "name"] }
        ]
      });
      if (!updatedShipment) {
        throw new AppError(404, "Shipment not found");
      }

      logger.info(`Shipment updated successfully: ${id}`);
      const response: ApiResponse<Shipment> = {
        success: true,
        message: "Shipment updated successfully",
        data: updatedShipment
      };
      res.json(response);
    } catch (error) {
      handleError(error, "update shipment", res);
    }
  },

  async deleteShipment(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params

      // Validate id parameter
      if (!id || isNaN(Number(id))) {
        throw new AppError(400, "Valid shipment ID is required")
      }

      // Check if shipment exists
      const existingShipment = await Shipment.findByPk(Number(id))
      if (!existingShipment) {
        throw new AppError(404, "Shipment not found")
      }

      // Delete associated shipping stages first
      await Stage.destroy({
        where: { shipmentId: Number(id) },
      })

      const deleted = await Shipment.destroy({
        where: { id: Number(id) },
      })

      if (!deleted) {
        throw new AppError(500, "Failed to delete shipment")
      }

      logger.info(`Shipment deleted successfully: ${id}`);
      const response: ApiResponse<null> = {
        success: true,
        message: "Shipment deleted successfully"
      };
      res.json(response);
    } catch (error) {
      handleError(error, "delete shipment", res);
    }
  },

  async trackShipment(req: Request, res: Response): Promise<any> {
    try {
      // ... existing validation and logic ...
      const { trackingId } = req.params
      const { lat, lng } = req.query

      // Validate tracking ID
      if (!trackingId || typeof trackingId !== 'string' || trackingId.trim().length === 0) {
        throw new AppError(400, "Valid tracking ID is required")
      }

      const shipment = await Shipment.findOne({
        where: { shipmentID: trackingId.trim() },
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "email", "name"],
          },
          {
            model: Stage,
            as: "stages",
            order: [["dateAndTime", "DESC"]],
          },
        ],
      })

      if (!shipment) {
        throw new AppError(404, "Tracking ID not found")
      }


      // Send notification email if admin exists and coordinates provided
      if (shipment.admin && lat && lng) {
        try {
          // Import sendCustomMail here to avoid circular dependencies
          const { sendCustomMail } = await import("../services/mailService")

          await sendCustomMail(shipment.admin.email, {
            subject: 'Shipment Tracked',
            senderName: shipment.senderName,
            recipientName: shipment.recipientName,
            shipmentID: shipment.shipmentID,
            location: { lat: String(lat), lng: String(lng) }
          })
        } catch (error) {
          logger.error('error occured sending tracking custom mail, error: ', error)
        }
      }
        logger.info(`Shipment tracked: ${trackingId}`);
        const response: ApiResponse<Shipment> = {
          success: true,
          data:
            shipment
        }

        res.json(response);
      } 
      catch (error) {
        handleError(error, "track shipment", res);
      }
    }
}
function validateCreateShipmentData(body: any) {
  throw new Error("Function not implemented.")
}

