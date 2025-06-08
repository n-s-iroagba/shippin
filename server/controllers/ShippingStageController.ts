import type { Request, Response, NextFunction } from "express"
import { ShippingStage } from "../models/ShippingStage"
import { ShipmentDetails } from "../models/ShipmentDetails"
import logger from "../utils/logger"
import { AppError } from "../AppError"

const shippingStageController = {
async createStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { shipmentId } = req.params
    const file = (req as any).file
    const data = { ...req.body }
    
    console.log('=== DEBUG INFO ===')
    console.log('shipmentId:', shipmentId)
    console.log('file:', file ? 'File present' : 'No file')
    console.log('req.body:', data)
    console.log('==================')

    // Validate required fields
    if (!data.title || !data.location || !data.carrierNote || !data.dateAndTime) {
      console.log('Missing required fields:')
      console.log('title:', !!data.title)
      console.log('location:', !!data.location)
      console.log('carrierNote:', !!data.carrierNote)
      console.log('dateAndTime:', !!data.dateAndTime)
      throw new Error("Title, location, carrier note, and date/time are required")
    }

    const shipment = await ShipmentDetails.findOne({ where: { id: shipmentId } })
    if (!shipment) {
      console.log('Shipment not found for ID:', shipmentId)
      throw new Error("Shipment not found")
    }
    console.log('Shipment found:', shipment.id)

    // Convert string values to proper types
    const stageData = {
      title: data.title,
      location: data.location,
      carrierNote: data.carrierNote,
      dateAndTime: new Date(data.dateAndTime),
      paymentStatus: data.paymentStatus || "",
      feeInDollars: data.feeInDollars ? Number.parseFloat(data.feeInDollars) : null,
      percentageNote: data.percentageNote || null,
      requiresFee: data.requiresFee === "true" || data.requiresFee === true,
      longitude:data.longitude,
      latitude:data.latitude,
      supportingDocument: file ? file.buffer : null,
      shipmentDetailsId: Number.parseInt(shipmentId),
    }

    console.log('Stage data to create:', {
      ...stageData,
      supportingDocument: stageData.supportingDocument ? 'Buffer present' : null
    })

    // Add validation for shipmentDetailsId
    if (isNaN(stageData.shipmentDetailsId)) {
      throw new Error('Invalid shipment ID')
    }

    // Validate dateAndTime
    if (isNaN(stageData.dateAndTime.getTime())) {
      throw new Error('Invalid date format')
    }

    console.log('About to create ShippingStage...')
    const status = await ShippingStage.create(stageData)
    console.log('Successfully created status:', status.id)
    
    res.status(201).json(status)
  } catch (error:any) {
    console.error('Error in createStatus:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    logger.error("Error creating shipment status:", { 
      error: error.message,
      stack: error.stack,
      shipmentId: req.params.shipmentId,
      body: req.body
    })
    
    return res.status(500).json({ 
      message: "Error creating shipping stage",
      error: error.message // Include error message for debugging
    })
  }
},

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { statusId } = req.params
      const file = (req as any).file
      const data = { ...req.body }

      const status = await ShippingStage.findByPk(statusId)
      if (!status) {
        return res.status(404).json({ message: "Shipping stage not found" })
      }

      // Handle file upload if present - store as blob
      if (file) {
        data.supportingDocument = file.buffer.toString("base64")
      }

      // Convert and validate data types
      const updateData: any = {}

      if (data.title) updateData.title = data.title
      if (data.location) updateData.location = data.location
      if (data.carrierNote) updateData.carrierNote = data.carrierNote
      if (data.dateAndTime) updateData.dateAndTime = new Date(data.dateAndTime)
      if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus
      if (data.feeInDollars !== undefined)
        updateData.feeInDollars = data.feeInDollars ? Number.parseFloat(data.feeInDollars) : null
      if (data.percentageNote !== undefined) updateData.percentageNote = data.percentageNote || null
      if (data.amountPaid !== undefined)
        updateData.amountPaid = data.amountPaid ? Number.parseFloat(data.amountPaid) : null
      if (data.paymentDate) updateData.paymentDate = new Date(data.paymentDate)
      if (data.supportingDocument) updateData.supportingDocument = data.supportingDocument

      await status.update(updateData)

      const updatedStatus = await ShippingStage.findByPk(statusId)
      res.json(updatedStatus)
    } catch (error) {
      console.error("Error updating shipment status:", error)
      return res.status(500).json({ message: "Error updating shipping stage" })
    }
  },


  async deleteShippingStage(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { shippingStageId } = req.params

    try {
      const status = await ShippingStage.findByPk(shippingStageId)
      if (!status) {
        return res.status(404).json({ message: "Shipping stage not found" })
      }

      await status.destroy()
      res.status(200).json({ message: "Shipping stage deleted successfully" })
    } catch (err) {
      console.error("Error deleting ShippingStage:", err)
      return res.status(500).json({ message: "Error deleting shipping stage" })
    }
  },

  async uploadReceipt(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { shippingStageId } = req.params
      const file = (req as any).file

      if (!file) {
        return res.status(400).json({ message: "No receipt file uploaded" })
      }

      const status = await ShippingStage.findByPk(shippingStageId)
      if (!status) {
        return res.status(404).json({ message: "Shipping stage not found" })
      }

      // Validate that this stage requires payment
      if (!status.feeInDollars || Number(status.feeInDollars) <= 0) {
        throw new AppError(400, "This shipping stage does not require payment")
      }

      await status.update({
        paymentReceipt: file.buffer,
        paymentStatus: "PENDING",
      })

      res.json({ message: "Receipt uploaded successfully" })
    } catch (error) {
      console.error("Receipt upload error:", error)
      return res.status(500).json({ message: "Failed to upload receipt" })
    }
  },

  async approvePayment(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { shippingStageId } = req.params
    const { paymentDate, amountPaid } = req.body

    try {
      // Validate input
      if (!paymentDate) {
        return res.status(400).json({ message: "Payment date is required" })
      }

      if (!amountPaid || isNaN(Number(amountPaid)) || Number(amountPaid) <= 0) {
        return res.status(400).json({ message: "Valid payment amount is required" })
      }

      const status = await ShippingStage.findByPk(shippingStageId)
      if (!status) {
        return res.status(404).json({ message: "Shipping stage not found" })
      }

      // Validate that this stage has a pending payment
      if (status.paymentStatus !== "PENDING") {
        return res.status(400).json({ message: "This shipping stage does not have a pending payment" })
      }

      // Validate that receipt exists
      if (!status.paymentReceipt) {
        return res.status(400).json({ message: "No payment receipt found for this shipping stage" })
      }

      await status.update({
        paymentDate: new Date(paymentDate),
        amountPaid: Number.parseFloat(amountPaid),
        paymentStatus: "PAID",
      })

      const updatedStatus = await ShippingStage.findByPk(shippingStageId)
      res.status(200).json({ message: "Payment approved successfully", status: updatedStatus })
    } catch (err) {
      console.error("Error approving payment:", err)
      return res.status(500).json({ message: "Error approving payment" })
    }
  },
}

export default shippingStageController
