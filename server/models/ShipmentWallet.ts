
import { Model, DataTypes, ForeignKey, NonAttribute } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';

export class ShipmentWallet extends Model {
  public id!: number;
  public coinName!: string;
  public walletAddress!: string;
  public adminId!: ForeignKey<Admin['id']>;
  public admin?:NonAttribute<Admin>
}

ShipmentWallet.init({
  id: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'shipmentWallet'
});
