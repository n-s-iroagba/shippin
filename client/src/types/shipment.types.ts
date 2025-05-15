

export type FreightType = 'AIR' | 'SEA' | 'LAND';

export type PaymentStatus = 'YET_TO_BE_PAID' | 'PENDING' | 'PAID' | 'NO_NEED_FOR_PAYMENT';

export interface ShipmentStatus {
  id: number;
  title: string;
  dateAndTime: string;
  carrierNote: string;
  paymentStatus: PaymentStatus;
  percentageNote?: number | null;
  feeInDollars: number | null;
  amountPaid: number;
  paymentReceipt: string|null;
  paymentDate: string | null;
  supportingDocument?: string | File  ;
}

export interface ShipmentDetails {
  id: number;
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
  shipmentStatuses?: ShipmentStatus[];
}
