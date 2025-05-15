
import { DataTypes, ForeignKey, Model } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';
import { ShippingStage } from './ShippingStage';

export interface LocationAttributes {
  id?: number;
  stageId: ForeignKey<ShippingStage['id']>;
  name: string;
  filePath: string;
}

class Location extends Model<LocationAttributes> implements LocationAttributes {
  public id?: number;
  public stageId!: ForeignKey<ShippingStage['id']>;
  public name!: string;
  public filePath!: string;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Admin,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Location',
  }
);
ShippingStage.hasOne(Location, { foreignKey: 'stageId' });
Location.belongsTo(ShippingStage, { foreignKey: 'stageId' });

export { Location };
