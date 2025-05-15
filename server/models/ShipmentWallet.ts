// models/ShipmentWallet.ts
import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/database'; // adjust path based on your setup

interface ShipmentWalletAttributes {
  id: number;
  coinName: string;
  walletAddress: string;
  adminId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShipmentWalletCreationAttributes extends Optional<ShipmentWalletAttributes, 'id'> {}

export class ShipmentWallet
  extends Model<ShipmentWalletAttributes, ShipmentWalletCreationAttributes>
  implements ShipmentWalletAttributes
{
  public id!: number;
  public coinName!: string;
  public walletAddress!: string;
  public adminId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShipmentWallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    coinName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'shipment_wallets',
    modelName: 'ShipmentWallet',
  }
);

export default ShipmentWallet;
