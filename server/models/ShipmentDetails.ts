import { Model, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, ENUM } from "sequelize";
import { Admin } from "./Admin"; // Ensure correct import
import { ShipmentStatus } from "./ShipmentStatus"; // Import related ShipmentStatus model
import { sequelize } from "../config/database";

export class ShipmentDetails extends Model<
  InferAttributes<ShipmentDetails>,
  InferCreationAttributes<ShipmentDetails>
> {
  declare id?: number;
  declare shipmentID: string;
  declare senderName: string;
  declare receivingAddress: string;
  declare recipientName: string;
  declare shipmentDescription: string;
  declare receipientEmail :string; 
  declare sendingPickupPoint:string; 
  declare shippingTakeoffAddress:string; 
  declare expectedTimeOfArrival:Date;
  declare adminId: ForeignKey<Admin["id"]>;
  declare freightType: 'AIR'|'SEA'|'LAND'
  declare kg:number
  declare dimensionInInches:string

  // One ShipmentDetails has many ShipmentStatus
  declare shipmentStatus?: ShipmentStatus[];
}

ShipmentDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    shipmentID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sendingPickupPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingTakeoffAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receivingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipmentDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Admin,
        key: "id",
      },
    },
    expectedTimeOfArrival: {
      type: DataTypes.DATE,
      allowNull: false
    },
    freightType: {
      type: ENUM('AIR', 'SEA', 'LAND')
    },
    kg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dimensionInInches: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receipientEmail: {
      type: DataTypes.STRING
    },
 
  },
  {
    sequelize,
    modelName: "shipmentDetails",
    timestamps: true,
  }
);




