import { DataTypes, ForeignKey, Model } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';

export interface DocumentTemplateAttributes {
  id?: number;
  adminId: ForeignKey<Admin['id']>;
  name: string;
  filePath: string;
}

class DocumentTemplate extends Model<DocumentTemplateAttributes> implements DocumentTemplateAttributes {
  public id?: number;
  public adminId!: ForeignKey<Admin['id']>;
  public name!: string;
  public filePath!: string;
}

DocumentTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adminId: {
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
    modelName: 'DocumentTemplate',
  }
);
Admin.hasMany(DocumentTemplate, { foreignKey: 'adminId' });
DocumentTemplate.belongsTo(Admin, { foreignKey: 'adminId' });
export { DocumentTemplate };
