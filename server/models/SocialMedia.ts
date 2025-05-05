
import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';

export class SocialMedia extends Model {
  public id!: number;
  public adminId!: number;
  public name!: string;
  public url!: string;
}

SocialMedia.init({
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  }
}, {
  sequelize,
  modelName: 'SocialMedia',
  timestamps: true
});

SocialMedia.belongsTo(Admin, { foreignKey: 'adminId' });
Admin.hasMany(SocialMedia, { foreignKey: 'adminId' });
