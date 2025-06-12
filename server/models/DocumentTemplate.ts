import { DataTypes, ForeignKey, Model } from 'sequelize';
import {sequelize} from '../config/database';
import { Admin } from './Admin';

export interface DocumentTemplateAttributes {
  id?: number;
  adminId: number;
  name: string;
  file: Buffer;
  fileType: string;
  fileName: string;
  fileSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class DocumentTemplate extends Model<DocumentTemplateAttributes> implements DocumentTemplateAttributes {
  public id?: number;
  public adminId!: number;
  public name!: string;
  public file!: Buffer;
  public fileType!: string;
  public fileName!: string;
  public fileSize!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    file: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'DocumentTemplate',
  }
);
Admin.hasMany(DocumentTemplate, { foreignKey: 'adminId', as: 'documentTemplate' });
DocumentTemplate.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
export { DocumentTemplate };
