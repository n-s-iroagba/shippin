import { ShipmentStatus } from "./ShipmentStatus";

export interface Shipment {
  id: string;
  shipmentID: string;
  senderName: string;
  sendingAddress: string;
  receivingAddress: string;
  recipientName: string;
  shipmentDescription: string;
  adminId:string;
  shipmentStatus: ShipmentStatus[]
}