
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Admin } from './Admin';

export interface FiatPlatformAttributes {
  id?: number;
  adminId: number;
  name: string;
  baseUrl: string;
  messageTemplate: string;
}

export class FiatPlatform extends Model<FiatPlatformAttributes> implements FiatPlatformAttributes {
  id?: number;
  adminId!: number;
  name!: string;
  baseUrl!: string;
  messageTemplate!: string;
}

FiatPlatform.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Admins',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  baseUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  messageTemplate: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'FiatPlatform'
});

FiatPlatform.belongsTo(Admin);
Admin.hasMany(FiatPlatform);
