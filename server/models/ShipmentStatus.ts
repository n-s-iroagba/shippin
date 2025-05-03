import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ShipmentDetails } from './ShipmentDetails';


export interface ShipmentStatusAttributes {
  id: string;
  shipmentDetailsId: string;
  location: string;
  status: string;
  description: string;
  timestamp: Date;
  feeInDollars?: number;
  paymentReceipt?: string;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  paymentStatus: 'PAID'|'YET_TO_BE_PAID'|'PENDING'
  requiresFee:boolean
  title:string
  supportingDocuments?: string[];
}

export class ShipmentStatus extends Model<ShipmentStatusAttributes> implements ShipmentStatusAttributes {
  id!: string;
  shipmentDetailsId!: string;
  location!: string;
  status!: string;
  description!: string;
  timestamp!: Date;
  feeInDollars?: number;
  paymentReceipt?: string;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  title!:string;
  paymentStatus: 'PAID'|'YET_TO_BE_PAID'|'PENDING' ='YET_TO_BE_PAID'
  requiresFee!:boolean
  supportingDocuments?: string[];
}

ShipmentStatus.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipmentDetailsId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ShipmentDetails',
      key: 'id'
    }
  },
  location: DataTypes.STRING,
  status: DataTypes.STRING,
  description: DataTypes.TEXT,
  timestamp: DataTypes.DATE,
  feeInDollars: DataTypes.DECIMAL(10, 2),
  paymentReceipt: DataTypes.STRING,
  amountPaid: DataTypes.DECIMAL(10, 2),
  paymentDate: DataTypes.DATE,
  percentageNote: DataTypes.STRING,
  supportingDocuments: DataTypes.ARRAY(DataTypes.STRING),
  title: DataTypes.STRING,
  paymentStatus: DataTypes.ENUM( 'PAID','YET_TO_BE_PAID','PENDING'),
  requiresFee: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: 'ShipmentStatus'
});

// Set up associations
ShipmentStatus.belongsTo(ShipmentDetails);
ShipmentDetails.hasMany(ShipmentStatus);