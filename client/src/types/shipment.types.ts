export interface ShipmentDetails {
  id: number
  shipmentID: string
  adminId: number
  senderName: string
  sendingPickupPoint: string
  shippingTakeoffAddress: string
  receivingAddress: string
  recipientName: string
  receipientEmail: string
  shipmentDescription: string
  expectedTimeOfArrival: Date
  freightType: "AIR" | "SEA" | "LAND"
  weight: number
  dimensionInInches: string
  createdAt: Date
  updatedAt: Date
  ShippingStages: ShippingStage[]
}

export interface CreateShipmentDto {
  senderName: string
  sendingPickupPoint: string
  shippingTakeoffAddress: string
  receivingAddress: string
  recipientName: string
  receipientEmail: string
  shipmentDescription: string
  expectedTimeOfArrival: Date
  freightType: "AIR" | "SEA" | "LAND"
  weight: number
  dimensionInInches: string
}

export interface ShippingStage {
  id: string
  title: string
  location: string
  carrierNote: string
  dateAndTime: Date
  percentageNote?: string
  feeInDollars?: number 
  paymentStatus: 'NO_PAYMENT_REQUIRED'|"UNPAID" | "PENDING" | "PAID"
  amountPaid?: number
  paymentDate?: Date
  supportingDocument?: File | null |Buffer
  paymentReceipt?:  File | null |Buffer
  shipmentDetailsId: number
     longitude: number
  latitude: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateShippingStage {

  title: string
  location: string
  carrierNote: string
  dateAndTime: Date
   percentageNote?: string
  feeInDollars?: number
  paymentStatus: 'NO_PAYMENT_REQUIRED'|"UNPAID" | "PENDING" | "PAID"
  amountPaid?: number
  paymentDate?: Date
  supportingDocument?: File | null
  paymentReceipt?:  File | null
   longitude: number
  latitude: number

}


