
import { Model, DataTypes, NonAttribute, Optional, ForeignKey } from 'sequelize';
import {sequelize} from '../config/database';
import { ShipmentDetails } from './ShipmentDetails';


interface ShipmentStatusAttributes {
  id: number
  feeInDollars: number | null
  amountPaid: number
  dateAndTime: Date
  requiresFee: boolean
  title:string;
  paymentStatus: 'YET_TO_BE_PAID' | 'PAID' | 'NO_NEED_FOR_PAYMENT'|'PENDING'
  paymentDate: Date
  paymentReceipt: string
  percentageNote: number | null
  carrierNote: string
  supportingDocuments?: string[]
  shipmentDetailsId: ForeignKey<ShipmentDetails['id']>
}
type ShipmentStatusCreationAttributes =
  Optional<
    Omit<ShipmentStatusAttributes,'id'| 'paymentReceipt' | 'amountPaid'|"paymentDate">,
    'feeInDollars' | 'percentageNote' | 'supportingDocuments'
  >
export class ShipmentStatus extends Model<
  ShipmentStatusAttributes, ShipmentStatusCreationAttributes
  
>{
  public id!: number;
  public feeInDollars: number|null= null;
  public amountPaid!:number;
  public dateAndTime!: Date;
  public requiresFee!: boolean;
  public title!:string;
  public paymentStatus!: 'YET_TO_BE_PAID'|'PENDING'|'PAID'|'NO_NEED_FOR_PAYMENT';
  public paymentReceipt!: string;
  public percentageNote:number|null = null
  public carrierNote!: string;
  public supportingDocuments?: string[];
  public shipmentDetailsId!: ForeignKey<ShipmentDetails['id']>;
  public  paymentDate: Date |null = null

  public shipmentDetails?:NonAttribute<ShipmentDetails>
}

ShipmentStatus.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  feeInDollars: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  amountPaid: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  dateAndTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  requiresFee: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  paymentReceipt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('YET_TO_BE_PAID', 'PENDING', 'PAID', 'NO_NEED_FOR_PAYMENT'),
    allowNull: true,
  },
  percentageNote: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },

  carrierNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supportingDocuments: {
    type: DataTypes.JSON, // <-- MySQL JSON column
    allowNull: true,
  },
  shipmentDetailsId: {
    type: DataTypes.INTEGER,
    references: {
      model: ShipmentDetails,
      key: 'id',
    },
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  title: {
    type:DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize,
  modelName: 'ShipmentStatus'
});


