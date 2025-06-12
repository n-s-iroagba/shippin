export type paymentStatus = 'PAID' | 'UNPAID' | 'PENDING' | 'NO_PAYMENT_REQUIRED';

export interface Stage {
  id: number;
  shipmentId: number;
  carrierNote: string;
  dateAndTime: Date;
  paymentReceipts: Blob[];
  feeName?: string;
  amountPaid?: number;
  paymentDate?: Date;
  paymentStatus: paymentStatus;
  title: string;
  location: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageCreationDto {
  shipmentId: number;
  carrierNote: string;
  dateAndTime: Date;
  feeName?: string;
  amountPaid?: number;
  paymentDate?: Date;
  paymentStatus: paymentStatus;
  title: string;
  location: string;
  longitude: number;
  latitude: number;
}

export interface UpdateStage {
  carrierNote?: string;
  dateAndTime?: Date;
  feeName?: string;
  amountPaid?: number;
  paymentDate?: Date;
  paymentStatus?: paymentStatus;
  title?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
}


