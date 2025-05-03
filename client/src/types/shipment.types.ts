
export type FreightType = 'AIR' | 'SEA' | 'LAND';

export type PaymentStatus = 'YET_TO_BE_PAID' | 'PENDING' | 'PAID' | 'NO_NEED_FOR_PAYMENT';

export interface ShipmentStatus {
  id: number;
  feeInDollars: number | null;
  amountPaid: number;
  dateAndTime: string;
  requiresFee: boolean;
  paymentStatus: PaymentStatus;
  paymentDate: string | null;
  paymentReceipt?: string;
  percentageNote?: number | null;
  title: string;
  carrierNote?: string;
  supportingDocuments?: string[];
}

export interface ShipmentDetails {
  id?: number;
  shipmentID: string;
  senderName: string;
  sendingPickupPoint: string;
  shippingTakeoffAddress: string;
  receivingAddress: string;
  recipientName: string;
  shipmentDescription: string;
  expectedTimeOfArrival: Date;
  freightType: FreightType;
  weight: number;
  dimensionInInches: string;
  receipientEmail: string;
  adminId?: number;
  shipmentStatus?: ShipmentStatus[];
}
