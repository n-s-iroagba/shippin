
import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';

export interface DefaultDocumentTemplateAttributes {
  id?: number;

  name: string;
  filePath: string;
}

class DefaultDocumentTemplate extends Model<DefaultDocumentTemplateAttributes> implements DefaultDocumentTemplateAttributes {
  public id?: number;

  public name!: string;
  public filePath!: string;
}

DefaultDocumentTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    modelName: 'DefaultDocumentTemplate',
  }
);

export { DefaultDocumentTemplate };
