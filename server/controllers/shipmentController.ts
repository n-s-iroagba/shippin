import type { Request, Response, NextFunction } from "express"
import { ShipmentDetails } from "../models/ShipmentDetails"
import { ShippingStage } from "../models/ShippingStage"
import logger from "../utils/logger"
import { Admin } from "../models/Admin"
import { AppError } from "../utils/error/AppError"

export const shipmentController = {
  async createShipment(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const adminId = req.params.adminId

  
      const trackingId = "SHP" + Date.now().toString() + Math.random().toString(36).substr(2, 4).toUpperCase()

      const shipmentData = {
        ...req.body,
        adminId: Number.parseInt(adminId),
        shipmentID: trackingId,
        expectedTimeOfArrival: new Date(req.body.expectedTimeOfArrival),
      }

      const shipment = await ShipmentDetails.create(shipmentData)


      const response = await ShipmentDetails.findByPk(shipment.id, {
        include: [
          {
            model: ShippingStage,
            as: "ShippingStages",
          },
        ],
      })

      res.status(201).json(response)
    } catch (error) {
      logger.error("Error creating shipment:", error)
      res.status(500).json({
        error: "Failed to create shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
  },

  async listShipments(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const adminId = Number.parseInt(req.params.adminId)

      const shipments = await ShipmentDetails.findAll({
        where: { adminId },
        attributes: [
          "id",
          "shipmentID",
          "senderName",
          "recipientName",
          "receivingAddress",
          "freightType",
          "expectedTimeOfArrival",
          "createdAt",
          "updatedAt",
        ],
        order: [["createdAt", "DESC"]],
      })

      return res.json(shipments)
    } catch (error) {
      logger.error("Error listing shipments:", error)
      res.status(500).json({
        error: "Failed to fetch shipments",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
  },

  async getShipmentDetails(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const { id } = req.params
    console.log('in get ship det')
      const shipment = await ShipmentDetails.findByPk(id, {
        include: [
          {
            model: ShippingStage,
            as: "ShippingStages",
            order: [["createdAt", "DESC"]],
          },
        ],
      })
    console.log(shipment)
      if (!shipment) {
        return res.status(404).json({ error: "Shipment not found" })
      }

      return  res.status(200).json(shipment)
    } catch (error) {
      logger.error("Error getting shipment details:", error)
      res.status(500).json({
        error: "Failed to fetch shipment details",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
  },

  async updateShipment(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const { id } = req.params

      // Convert date if provided
      if (req.body.expectedTimeOfArrival) {
        req.body.expectedTimeOfArrival = new Date(req.body.expectedTimeOfArrival)
      }

      const [updated] = await ShipmentDetails.update(req.body, {
        where: { id: Number.parseInt(id) },
      })

      if (!updated) {
        return res.status(404).json({ error: "Shipment not found" })
      }

      const shipment = await ShipmentDetails.findByPk(id, {
        include: [
          {
            model: ShippingStage,
            as: "ShippingStages",
          },
        ],
      })

      return res.json(shipment)
    } catch (error) {
      logger.error("Error updating shipment:", error)
      res.status(500).json({
        error: "Failed to update shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
  },

  async deleteShipment(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const { id } = req.params

      // Delete associated shipping stages first
      await ShippingStage.destroy({
        where: { shipmentDetailsId: Number.parseInt(id) },
      })

      const deleted = await ShipmentDetails.destroy({
        where: { id: Number.parseInt(id) },
      })

      if (!deleted) {
        return res.status(404).json({ error: "Shipment not found" })
      }

      return res.json({ message: "Shipment deleted successfully" })
    } catch (error) {
      logger.error("Error deleting shipment:", error)
      res.status(500).json({
        error: "Failed to delete shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
  },

   async trackShipment(req: Request, res: Response, next: NextFunction) {
    console.log("in tracking function")
    try {
      const { trackingId } = req.params
      const { lat, lng } = req.query

      if (!trackingId) {
        throw new AppError(400, "Tracking ID is required")
      }

      const shipmentDetails = await ShipmentDetails.findOne({
        where: { shipmentID: trackingId },
      })

      if (!shipmentDetails) {
        throw new AppError(404, "Tracking ID not found")
      }
      const stages = await ShippingStage.findAll({
        where: { shipmentDetailsId: shipmentDetails.id },
        order: [["dateAndTime", "DESC"]],
      })
      console.log(stages)

      const admin = await Admin.findByPk(shipmentDetails.adminId)

      if (admin) {
        try {
          await sendCustomMail(admin.email, {subject:'Shipment Tracked',
            senderName: shipmentDetails.senderName,
            recipientName: shipmentDetails.recipientName,
            receivingAddress: shipmentDetails.receivingAddress,
            shipmentID: shipmentDetails.shipmentID,
            loction: { lat, lng }

          });
        } catch (error) {
          console.error('Failed to send email:', error);
        }
      }

      res.json({
        shipmentDetails,
        shippingStages: stages,
      })
    } catch (error) {
      console.error("Tracking error:", error)
      if (error instanceof AppError && error.message === "Tracking ID not found") {
        next(error)
      } else {
        next(new AppError(500, "Failed to load tracking data"))
      }
    }
  }
}
