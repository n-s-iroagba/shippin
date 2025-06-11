import { Model, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database';
import { Admin } from './Admin';

export class SocialMedia extends Model {
  public id!: number;
  public adminId!: ForeignKey<Admin['id']>;
  public name!: string;
  public url!: string;
  public logo!: Buffer; 
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
  },
  logo: {
    type: DataTypes.BLOB('long'), 
  }
}, {
  sequelize,
  modelName: 'SocialMedia',
  timestamps: true
});

SocialMedia.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
Admin.hasMany(SocialMedia, { foreignKey: 'adminId', as: 'socialMedia' });