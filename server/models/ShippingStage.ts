import { Model, DataTypes, ForeignKey, Optional, NonAttribute } from 'sequelize';
import { sequelize } from '../config/database';
import { ShipmentDetails } from './ShipmentDetails';





// Main Attributes Interface
export interface ShippingStageAttributes {
  id: string;
  shipmentDetailsId: ForeignKey<ShipmentDetails['id']>;
  shipmentDetails?:NonAttribute<ShipmentDetails>
  carrierNote: string;
  dateAndTime: Date
  feeInDollars?: number | null;
  paymentReceipt?: string;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  paymentStatus: 'PAID' | 'YET_TO_BE_PAID' | 'PENDING' |'NO_NEED_FOR_PAYMENT';
  requiresFee: boolean;
  title: string;
  supportingDocument?: string;
}

// Creation Attributes Interface (omit `id` and `amountPaid`, mark some as optional)
export interface ShippingStageCreationAttributes
  extends Optional<ShippingStageAttributes, 'id' | 'amountPaid' | 'feeInDollars' | 'paymentReceipt' | 'paymentDate' | 'percentageNote' | 'supportingDocument'> {}

// Sequelize Model Class
export class ShippingStage
  extends Model<ShippingStageAttributes, ShippingStageCreationAttributes>
  implements ShippingStageAttributes
{
  id!: string;
  shipmentDetailsId!: ForeignKey<ShipmentDetails['id']>;
  carrierNote!: string;
  dateAndTime!: Date;
  feeInDollars?: number|null;
  paymentReceipt?: string;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  paymentStatus!: 'PAID' | 'YET_TO_BE_PAID' | 'PENDING' |'NO_NEED_FOR_PAYMENT';
  requiresFee!: boolean;
  shipmentDetails?:NonAttribute<ShipmentDetails>
  title!: string;
  supportingDocument?: string;
}


ShippingStage.init({
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
  paymentStatus: DataTypes.ENUM( 'PAID','YET_TO_BE_PAID','PENDING','NO_NEED_FOR_PAYMENT'),
  requiresFee: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: 'ShippingStage'
});
ShipmentDetails.hasMany(ShippingStage, {
  foreignKey: 'shipmentDetailsId',
});
ShippingStage.belongsTo(ShipmentDetails, {
  foreignKey: 'shipmentDetailsId',
});