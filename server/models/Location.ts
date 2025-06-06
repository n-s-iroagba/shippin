
import { DataTypes, ForeignKey, Model } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';
import { ShippingStage } from './ShippingStage';

export interface LocationAttributes {
  id?: number;
  stageId: ForeignKey<ShippingStage['id']>;
  name: string;
  longitude: number;
  latitude : number;
}

class Location extends Model<LocationAttributes> implements LocationAttributes {
  public id?: number;
  public stageId!: ForeignKey<ShippingStage['id']>;
  public name!: string;
  public longitude!: number;
  public latitude! : number;

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
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
      latitude: {
      type: DataTypes.DOUBLE,
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
