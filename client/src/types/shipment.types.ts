import { Stage } from "./stage.types"

export type FreightType= 'RECEIVED (WAREHOUSE)'|'ONBOARD'|'IN TRANSIT'
export type ShipmentStatus = 'RECEIVED (WAREHOUSE)'|'ONBOARD'|'IN TRANSIT'

export interface Shipment {
  id: number
  shipmentID: string
  adminId: number
  senderName: string
  codename: string
  origin: string
  destination: string
  recipientName: string
  expectedTimeOfArrival: Date
  status: ShipmentStatus
  freightType: FreightType
  createdAt: Date
  updatedAt: Date
  shipmentDescription: string
  sendingPickupPoint: string
  receivingAddress: string
  weight: number
  dimensionInInches: string
  receipientEmail: string
  stages: Stage[]
}

export interface CreateShipmentDto {
  senderName: string
  codename: string
  origin: string
  destination: string
  recipientName: string
  expectedTimeOfArrival: Date
  status: ShipmentStatus
  freightType: FreightType
  shipmentDescription: string
  sendingPickupPoint: string
  receivingAddress: string
  weight: number
  dimensionInInches: string
  receipientEmail: string
}

