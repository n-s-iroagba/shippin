import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ShipmentDetailsAttributes {
  id: string;
  shipmentID: string;
  adminId: string;
  senderName: string;
  sendingPickupPoint: string;
  shippingTakeoffAddress: string;
  receivingAddress: string;
  recipientName: string;
  shipmentDescription: string;
  expectedTimeOfArrival: Date;
  freightType: 'AIR' | 'SEA' | 'LAND';
  weight: number;
  dimensionInInches: string;
  receipientEmail: string;
}

export class ShipmentDetails extends Model<ShipmentDetailsAttributes> implements ShipmentDetailsAttributes {
  id!: string;
  shipmentID!: string;
  adminId!: string;
  senderName!: string;
  sendingPickupPoint!: string;
  shippingTakeoffAddress!: string;
  receivingAddress!: string;
  recipientName!: string;
  shipmentDescription!: string;
  expectedTimeOfArrival!: Date;
  freightType!: 'AIR' | 'SEA' | 'LAND';
  weight!: number;
  dimensionInInches!: string;
  receipientEmail!: string;
}

ShipmentDetails.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipmentID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Admins',
      key: 'id'
    }
  },
  senderName: DataTypes.STRING,
  sendingPickupPoint: DataTypes.STRING,
  shippingTakeoffAddress: DataTypes.STRING,
  receivingAddress: DataTypes.STRING,
  recipientName: DataTypes.STRING,
  shipmentDescription: DataTypes.TEXT,
  expectedTimeOfArrival: DataTypes.DATE,
  freightType: {
    type: DataTypes.ENUM('AIR', 'SEA', 'LAND'),
    allowNull: false
  },
  weight: DataTypes.FLOAT,
  dimensionInInches: DataTypes.STRING,
  receipientEmail: DataTypes.STRING
}, {
  sequelize,
  modelName: 'ShipmentDetails'
});