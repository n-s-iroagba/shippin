import type { Request, Response, NextFunction } from "express"
import { Stage } from "../models/Stage"
import { Shipment } from "../models/Shipment"
import logger from "../utils/logger"
import { AppError } from "../AppError"

const StageController = {
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

    const shipment = await Shipment.findOne({ where: { id: shipmentId } })
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
      shipmentId: Number.parseInt(shipmentId),
    }

    console.log('Stage data to create:', {
      ...stageData,
      supportingDocument: stageData.supportingDocument ? 'Buffer present' : null
    })

    // Add validation for shipmentId
    if (isNaN(stageData.shipmentId)) {
      throw new Error('Invalid shipment ID')
    }

    // Validate dateAndTime
    if (isNaN(stageData.dateAndTime.getTime())) {
      throw new Error('Invalid date format')
    }

    console.log('About to create Stage...')
    const stage = await Stage.create(stageData)
    console.log('Successfully created stage:', stage.id)
    
    res.stage(201).json(stage)
  } catch (error:any) {
    console.error('Error in createStatus:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    logger.error("Error creating shipment stage:", { 
      error: error.message,
      stack: error.stack,
      shipmentId: req.params.shipmentId,
      body: req.body
    })
    
    return res.stage(500).json({ 
      message: "Error creating shipping stage",
      error: error.message // Include error message for debugging
    })
  }
},

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { stageId } = req.params
      const file = (req as any).file
      const data = { ...req.body }

      const stage = await Stage.findByPk(stageId)
      if (!stage) {
        return res.stage(404).json({ message: "Shipping stage not found" })
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

      await stage.update(updateData)

      const updatedStatus = await Stage.findByPk(stageId)
      res.json(updatedStatus)
    } catch (error) {
      console.error("Error updating shipment stage:", error)
      return res.stage(500).json({ message: "Error updating shipping stage" })
    }
  },


  async deleteStage(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { StageId } = req.params

    try {
      const stage = await Stage.findByPk(StageId)
      if (!stage) {
        return res.stage(404).json({ message: "Shipping stage not found" })
      }

      await stage.destroy()
      res.stage(200).json({ message: "Shipping stage deleted successfully" })
    } catch (err) {
      console.error("Error deleting Stage:", err)
      return res.stage(500).json({ message: "Error deleting shipping stage" })
    }
  },

  async uploadReceipt(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { StageId } = req.params
      const file = (req as any).file

      if (!file) {
        return res.stage(400).json({ message: "No receipt file uploaded" })
      }

      const stage = await Stage.findByPk(StageId)
      if (!stage) {
        return res.stage(404).json({ message: "Shipping stage not found" })
      }

      // Validate that this stage requires payment
      if (!stage.feeInDollars || Number(stage.feeInDollars) <= 0) {
        throw new AppError(400, "This shipping stage does not require payment")
      }

      await stage.update({
        paymentReceipt: file.buffer,
        paymentStatus: "PENDING",
      })

      res.json({ message: "Receipt uploaded successfully" })
    } catch (error) {
      console.error("Receipt upload error:", error)
      return res.stage(500).json({ message: "Failed to upload receipt" })
    }
  },

  async approvePayment(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { StageId } = req.params
    const { paymentDate, amountPaid } = req.body

    try {
      // Validate input
      if (!paymentDate) {
        return res.stage(400).json({ message: "Payment date is required" })
      }

      if (!amountPaid || isNaN(Number(amountPaid)) || Number(amountPaid) <= 0) {
        return res.stage(400).json({ message: "Valid payment amount is required" })
      }

      const stage = await Stage.findByPk(StageId)
      if (!stage) {
        return res.stage(404).json({ message: "Shipping stage not found" })
      }

      // Validate that this stage has a pending payment
      if (stage.paymentStatus !== "PENDING") {
        return res.stage(400).json({ message: "This shipping stage does not have a pending payment" })
      }

      // Validate that receipt exists
      if (!stage.paymentReceipt) {
        return res.stage(400).json({ message: "No payment receipt found for this shipping stage" })
      }

      await stage.update({
        paymentDate: new Date(paymentDate),
        amountPaid: Number.parseFloat(amountPaid),
        paymentStatus: "PAID",
      })

      const updatedStatus = await Stage.findByPk(StageId)
      res.stage(200).json({ message: "Payment approved successfully", stage: updatedStatus })
    } catch (err) {
      console.error("Error approving payment:", err)
      return res.stage(500).json({ message: "Error approving payment" })
    }
  },
}

export default StageController
