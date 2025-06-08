import type { Request, Response } from "express"
import { DocumentTemplate } from "../models/DocumentTemplate"
import logger from "../utils/logger"

export const documentTemplateController = {
  listTemplates: async (req: Request, res: Response): Promise<any> => {
    try {
      const adminId = Number.parseInt(req.params.adminId)
      if (isNaN(adminId)) {
        return res.status(400).json({ message: "Invalid admin ID" })
      }

      const templates = await DocumentTemplate.findAll({
        where: { adminId },
        order: [["createdAt", "DESC"]],
      })

      res.status(200).json(templates)
    } catch (error) {
      logger.error("Failed to fetch templates:", { error })
      return res.status(500).json({ message: "Failed to fetch document templates" })
    }
  },

  createTemplate: async (req: Request, res: Response): Promise<any> => {
    try {
      const adminId = Number.parseInt(req.params.adminId)
      if (isNaN(adminId)) {
        return res.status(400).json({ message: "Invalid admin ID" })
      }

      const { name } = req.body
      const file = req.file

      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Template name is required" })
      }

      if (!file) {
        return res.status(400).json({ message: "File is required" })
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type. Only PDF and Word documents are allowed." })
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return res.status(400).json({ message: "File size must be less than 10MB" })
      }

      const template = await DocumentTemplate.create({
        adminId,
        name: name.trim(),
        filePath: file.buffer.toString("base64"),
      })

      res.status(201).json(template)
    } catch (error) {
      logger.error("Create template error:", { error })
      return res.status(500).json({ message: "Failed to create template" })
    }
  },

  updateTemplate: async (req: Request, res: Response): Promise<any> => {
    try {
      const adminId = Number.parseInt(req.params.adminId)
      const templateId = Number.parseInt(req.params.id)

      if (isNaN(adminId) || isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid admin ID or template ID" })
      }

      const { name } = req.body
      const file = req.file

      const template = await DocumentTemplate.findByPk(templateId)
      if (!template) {
        return res.status(404).json({ message: "Template not found" })
      }

      if (template.adminId !== adminId) {
        return res.status(403).json({ message: "Not authorized to update this template" })
      }

      if (name && name.trim()) {
        template.name = name.trim()
      }

      if (file) {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]

        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: "Invalid file type. Only PDF and Word documents are allowed." })
        }

        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          return res.status(400).json({ message: "File size must be less than 10MB" })
        }

        template.filePath = file.buffer.toString("base64")
      }

      await template.save()
      res.status(200).json(template)
    } catch (error) {
      logger.error("Update template error:", { error })
      return res.status(500).json({ message: "Failed to update template" })
    }
  },

  deleteTemplate: async (req: Request, res: Response): Promise<any> => {
    try {
      const adminId = Number.parseInt(req.params.adminId)
      const templateId = Number.parseInt(req.params.id)

      if (isNaN(adminId) || isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid admin ID or template ID" })
      }

      const template = await DocumentTemplate.findByPk(templateId)
      if (!template) {
        return res.status(404).json({ message: "Template not found" })
      }

      if (template.adminId !== adminId) {
        return res.status(403).json({ message: "Not authorized to delete this template" })
      }

      await template.destroy()
      res.status(200).json({ message: "Template deleted successfully" })
    } catch (error) {
      logger.error("Delete template error:", { error })
      return res.status(500).json({ message: "Failed to delete template" })
    }
  },

  downloadTemplate: async (req: Request, res: Response): Promise<any> => {
    try {
      const adminId = Number.parseInt(req.params.adminId)
      const templateId = Number.parseInt(req.params.id)

      if (isNaN(adminId) || isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid admin ID or template ID" })
      }

      const template = await DocumentTemplate.findByPk(templateId)
      if (!template) {
        return res.status(404).json({ message: "Template not found" })
      }

      if (template.adminId !== adminId) {
        return res.status(403).json({ message: "Not authorized to access this template" })
      }

      const buffer = Buffer.from(template.filePath, "base64")
      res.setHeader("Content-Type", "application/octet-stream")
      res.setHeader("Content-Disposition", `attachment; filename="${template.name}"`)
      res.send(buffer)
    } catch (error) {
      logger.error("Download template error:", { error })
      return res.status(500).json({ message: "Failed to download template" })
    }
  }
}