
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Admin } from './Admin';

export class CryptoWallet extends Model {
  public id!: number;
  public adminId!: number;
  public currency!: string;
  public walletAddress!: string;
  public label?: string;
}

CryptoWallet.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id'
    }
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CryptoWallet',
  timestamps: true
});

CryptoWallet.belongsTo(Admin, { foreignKey: 'adminId' });
Admin.hasMany(CryptoWallet, { foreignKey: 'adminId' });
