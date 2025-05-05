import { Model, DataTypes, ForeignKey, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { ShipmentDetails } from './ShipmentDetails';




// Main Attributes Interface
export interface ShipmentStatusAttributes {
  id: string;
  shipmentDetailsId: ForeignKey<ShipmentDetails['id']>;
  carrierNote: string;
  dateAndTime: Date;
  feeInDollars?: number;
  paymentReceipt?: string;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  paymentStatus: 'PAID' | 'YET_TO_BE_PAID' | 'PENDING';
  requiresFee: boolean;
  title: string;
  supportingDocument?: string;
}

// Creation Attributes Interface (omit `id` and `amountPaid`, mark some as optional)
export interface ShipmentStatusCreationAttributes
  extends Optional<ShipmentStatusAttributes, 'id' | 'amountPaid' | 'feeInDollars' | 'paymentReceipt' | 'paymentDate' | 'percentageNote' | 'supportingDocument'> {}

// Sequelize Model Class
export class ShipmentStatus
  extends Model<ShipmentStatusAttributes, ShipmentStatusCreationAttributes>
  implements ShipmentStatusAttributes
{
  id!: string;
  shipmentDetailsId!: ForeignKey<ShipmentDetails['id']>;
  carrierNote!: string;
  dateAndTime!: Date;
  feeInDollars?: number;
  paymentReceipt?: string;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  paymentStatus: 'PAID' | 'YET_TO_BE_PAID' | 'PENDING' = 'YET_TO_BE_PAID';
  requiresFee!: boolean;
  title!: string;
  supportingDocument?: string;
}


ShipmentStatus.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true,
  },
  shipmentDetailsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ShipmentDetails',
      key: 'id'
    }
  },
  carrierNote: DataTypes.TEXT,
  dateAndTime: DataTypes.DATE,
  feeInDollars: DataTypes.DECIMAL(10, 2),
  paymentReceipt: DataTypes.STRING,
  amountPaid: DataTypes.DECIMAL(10, 2),
  paymentDate: DataTypes.DATE,
  percentageNote: DataTypes.STRING,
  supportingDocument:DataTypes.STRING,
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