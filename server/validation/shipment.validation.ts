import { ShipmentCreationDto } from "../dto/creationDtos"
import { Shipment } from "../models/Shipment"
import { ValidationError, ValidationErrorItem } from "../utils/error/errorClasses"

export const validateShipmentUpdateData = (data: Partial<Shipment>): ValidationError | void => {
  const errors: ValidationErrorItem[] = []

  if (data.senderName !== undefined && !data.senderName?.trim()) {
    errors.push({
      field: "senderName",
      message: "Sender name cannot be empty",
      value: data.senderName
    })
  }

  if (data.codename !== undefined && !data.codename?.trim()) {
    errors.push({
      field: "codename",
      message: "Codename cannot be empty",
      value: data.codename
    })
  }

  if (data.origin !== undefined && !data.origin?.trim()) {
    errors.push({
      field: "origin",
      message: "Origin cannot be empty",
      value: data.origin
    })
  }

  if (data.destination !== undefined && !data.destination?.trim()) {
    errors.push({
      field: "destination",
      message: "Destination cannot be empty",
      value: data.destination
    })
  }

  if (data.recipientName !== undefined && !data.recipientName?.trim()) {
    errors.push({
      field: "recipientName",
      message: "Recipient name cannot be empty",
      value: data.recipientName
    })
  }

  if (data.receipientEmail !== undefined) {
    if (!data.receipientEmail?.trim()) {
      errors.push({
        field: "receipientEmail",
        message: "Recipient email cannot be empty",
        value: data.receipientEmail
      })
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.receipientEmail)) {
        errors.push({
          field: "receipientEmail",
          message: "Valid recipient email is required",
          value: data.receipientEmail
        })
      }
    }
  }

  if (data.freightType !== undefined && !["AIR", "SEA", "LAND"].includes(data.freightType)) {
    errors.push({
      field: "freightType",
      message: "Valid freight type is required (AIR, SEA, or LAND)",
      value: data.freightType
    })
  }

  if (data.status !== undefined && !["RECEIVED (WAREHOUSE)", "ONBOARD", "IN TRANSIT"].includes(data.status)) {
    errors.push({
      field: "status",
      message: "Valid status is required (RECEIVED (WAREHOUSE), ONBOARD, or IN TRANSIT)",
      value: data.status
    })
  }

  if (data.expectedTimeOfArrival !== undefined) {
    const date = new Date(data.expectedTimeOfArrival)
    if (isNaN(date.getTime())) {
      errors.push({
        field: "expectedTimeOfArrival",
        message: "Valid expected time of arrival date is required",
        value: data.expectedTimeOfArrival
      })
    }
  }

  if (errors.length) throw new ValidationError(errors, 'create shipment validation error occured ')
}

export const validateShipmentCreationDto = (data: ShipmentCreationDto): ValidationError | void => {
  const errors: ValidationErrorItem[] = []

  if (!data.senderName?.trim()) {
    errors.push({
      field: "senderName",
      message: "Sender name is required",
      value: data.senderName
    })
  }

  if (!data.codename?.trim()) {
    errors.push({
      field: "codename",
      message: "Codename is required",
      value: data.codename
    })
  }

  if (!data.origin?.trim()) {
    errors.push({
      field: "origin",
      message: "Origin is required",
      value: data.origin
    })
  }

  if (!data.destination?.trim()) {
    errors.push({
      field: "destination",
      message: "Destination is required",
      value: data.destination
    })
  }

  if (!data.recipientName?.trim()) {
    errors.push({
      field: "recipientName",
      message: "Recipient name is required",
      value: data.recipientName
    })
  }

  if (!data.receipientEmail?.trim()) {
    errors.push({
      field: "receipientEmail",
      message: "Recipient email is required",
      value: data.receipientEmail
    })
  }

  if (data.receipientEmail?.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.receipientEmail)) {
      errors.push({
        field: "receipientEmail",
        message: "Valid recipient email is required",
        value: data.receipientEmail
      })
    }
  }

  if (!data.expectedTimeOfArrival) {
    errors.push({
      field: "expectedTimeOfArrival",
      message: "Expected time of arrival is required",
      value: data.expectedTimeOfArrival
    })
  } else {
    const date = new Date(data.expectedTimeOfArrival)
    if (isNaN(date.getTime())) {
      errors.push({
        field: "expectedTimeOfArrival",
        message: "Valid expected time of arrival date is required",
        value: data.expectedTimeOfArrival
      })
    }
    if (date < new Date()) {
      errors.push({
        field: "expectedTimeOfArrival",
        message: "Expected time of arrival cannot be in the past",
        value: data.expectedTimeOfArrival
      })
    }
  }

  if (!data.freightType || !["AIR", "SEA", "LAND"].includes(data.freightType)) {
    errors.push({
      field: "freightType",
      message: "Valid freight type is required (AIR, SEA, or LAND)",
      value: data.freightType
    })
  }
  if (errors.length) throw new ValidationError(errors, 'update shipment validation error occured')
}