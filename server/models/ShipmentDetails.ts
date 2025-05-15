import { Model, DataTypes, ForeignKey, NonAttribute } from 'sequelize';
import { sequelize } from '../config/database';
import { Admin } from './Admin';
import { ShippingStage } from './ShippingStage';

export interface ShipmentDetailsAttributes {
  id: number;
  shipmentID: string;
  adminId: ForeignKey<Admin['id']>;
  admin?:NonAttribute<Admin>
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
shippingStagees?:NonAttribute<ShippingStage[]>
}

export class ShipmentDetails extends Model<ShipmentDetailsAttributes> implements ShipmentDetailsAttributes {
  id!: number;
  shipmentID!: string;
  adminId!: ForeignKey<Admin['id']>;
  admin?:NonAttribute<Admin>
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
    type: DataTypes.INTEGER,
     autoIncrement:true,
    primaryKey: true
  },
  shipmentID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
