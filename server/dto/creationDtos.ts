import { FreightType, ShipmentStatus } from "../types/shipment.types"

export type ShipmentCreationDto ={
  senderName: string
  codename: string
  origin: string
  destination: string
  recipientName: string
  expectedTimeOfArrival: Date
  status: ShipmentStatus
  freightType: FreightType
  receipientEmail: string
    
}

export type SocialMediaCreationDto={
  name: string;
  url: string;
  logo?: Buffer
}

export type StageCreationDto ={

}