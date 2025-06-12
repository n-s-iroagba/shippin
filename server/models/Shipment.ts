import {
  DataTypes,
  Model,
  InferAttributes,

  CreationOptional,
  ForeignKey,
  NonAttribute,
  Association
} from 'sequelize';
import { sequelize } from '../config/database'; // Adjust path as needed
import { Admin } from './Admin'; // Adjust path as needed
import { FreightType, ShipmentStatus } from '../types/shipment.types';

export interface ShipmentAttributes {
  id: number
  shipmentID: string
  adminId: number
  admin?: NonAttribute<Admin>
  senderName: string
  codename: string
  origin: string
  destination: string
  recipientName: string
  expectedTimeOfArrival: Date
  status: ShipmentStatus
  freightType: FreightType
  receipientEmail: string
  createdAt: Date
  updatedAt: Date
}
export interface ShipmentCreationAttributes extends Omit<ShipmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'admin'> {
  receptionDate?: Date
}
export class Shipment extends Model<
  InferAttributes<Shipment>,
  ShipmentCreationAttributes
> implements ShipmentAttributes {
  declare id: CreationOptional<number>
  declare shipmentID: string
  declare adminId: number
  declare admin?: NonAttribute<Admin>
  declare senderName: string
  declare codename: string
  declare origin: string
  declare destination: string
  declare recipientName: string
  declare expectedTimeOfArrival: Date

  declare status: ShipmentStatus
  declare freightType: FreightType
  declare receipientEmail: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Association declarations
  declare static associations: {
    admin: Association<Shipment, Admin>
  }
}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipmentID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Admin,
        key: 'id',
      },
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectedTimeOfArrival: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('RECEIVED (WAREHOUSE)', 'ONBOARD', 'IN TRANSIT'),
      allowNull: false,
      defaultValue: 'RECEIVED (WAREHOUSE)',
    },
    freightType: {
      type: DataTypes.ENUM("AIR", "SEA", "LAND"),
      allowNull: false,
    },
    receipientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Shipment',
    tableName: 'shipments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shipmentID'],
      },
      {
        fields: ['adminId'],
      },
      {
        fields: ['freightType'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Shipment.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin',
});

Admin.hasMany(Shipment, {
  foreignKey: 'adminId',
  as: 'shipments',
});

export default Shipment;