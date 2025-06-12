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
  carrierNote: string
  dateAndTime: Date
  paymentStatus: 'NO_PAYMENT_REQUIRED' | "UNPAID" | "PENDING" | "PAID"
  title: string
  location: string
  longitude: number
  latitude: number
}

export type CryptoWalletCreationDto = {
   currency: string;
  walletAddress: string;
}

export type DocumentTemplateCreationDto = {
  name: string;
  
}