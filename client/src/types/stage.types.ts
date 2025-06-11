export interface Stage {
  id: number
  shipmentId: number
  carrierNote: string
  dateAndTime: Date
  paymentReceipts: Buffer[] // Array of Buffers
  feeName?: string
  amountPaid?: number
  paymentDate?: Date
  paymentStatus: paymentStatus
  title: string
  location: string
  longitude: number
  latitude: number
}
export type paymentStatus = 'NO_PAYMENT_REQUIRED' | "UNPAID" | "PENDING" | "PAID"

export interface CreateStage {
  shipmentId: number
  carrierNote: string
  dateAndTime: Date
  feeName?: string
  amountPaid?: number
  paymentDate?: Date
  paymentStatus: paymentStatus
  title: string
  location: string
  longitude: number
  latitude: number
}


