import { Model, DataTypes, type ForeignKey, type Optional, type NonAttribute } from "sequelize"
import { sequelize } from "../config/database"
import { Shipment } from "./Shipment"
import { paymentStatus } from "../types/stage.types"

// Main Attributes Interface
export interface StageAttributes {
  id: number // Changed from string to number to match DataTypes.INTEGER
  shipmentId: number
  carrierNote: string
  dateAndTime: Date
  paymentReceipts: Buffer[] // Array of Buffers
  feeName?: string
  amountPaid?: number
  paymentDate?: Date
  paymentStatus: paymentStatus
  title: string
  location: string
  longitude: number
  latitude: number
  createdAt: Date
  updatedAt: Date
}

// Creation Attributes Interface
export interface StageCreationAttributes
  extends Optional<
    StageAttributes,
    "id" | "amountPaid" | "paymentReceipts" | "paymentDate" | "feeName" | 'createdAt' | 'updatedAt'
  > {}

// Sequelize Model Class
export class Stage
  extends Model<StageAttributes, StageCreationAttributes>
  implements StageAttributes {
  id!: number // Changed from string to number
  shipmentId!: number
  carrierNote!: string
  dateAndTime!: Date
  paymentReceipts!: Buffer[]
  feeName?: string
  amountPaid?: number
  paymentDate?: Date
  paymentStatus!: paymentStatus
  title!: string
  location!: string
  longitude!: number
  latitude!: number
  createdAt!: Date
  updatedAt!: Date

  // Association property
  shipment?: NonAttribute<Shipment>
}

Stage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Shipment",
        key: "id",
      },
      validate: {
        notNull: {
          msg: 'Shipment ID is required'
        },
        isInt: {
          msg: 'Shipment ID must be an integer'
        }
      }
    },
    carrierNote: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Carrier note cannot be empty'
        },
        len: {
          args: [1, 2000],
          msg: 'Carrier note must be between 1 and 2000 characters'
        }
      }
    },
    dateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date and time is required'
        },
        isDate: {
          msg: 'Must be a valid date',
          args:true
        }
      }
    },
    paymentReceipts: {
      type: DataTypes.JSON, // Changed to JSON to store array of Buffers
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidReceiptsArray(value: any) {
          if (value !== null && value !== undefined) {
            if (!Array.isArray(value)) {
              throw new Error('Payment receipts must be an array');
            }
          }
        }
      }
    },
    feeName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Fee name must be less than 255 characters'
        }
      }
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: 'Amount paid must be a valid decimal number'
        },
        min: {
          args: [0],
          msg: 'Amount paid cannot be negative'
        }
      }
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Payment date must be a valid date',
          args:true
        }
      }
    },
    paymentStatus: {
      type: DataTypes.ENUM("PAID", "UNPAID", "PENDING", "NO_PAYMENT_REQUIRED"), // Fixed enum value
      allowNull: false,
      defaultValue: "NO_PAYMENT_REQUIRED",
      validate: {
        isIn: {
          args: [["PAID", "UNPAID", "PENDING", "NO_PAYMENT_REQUIRED"]],
          msg: 'Payment status must be one of: PAID, UNPAID, PENDING, NO_PAYMENT_REQUIRED'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'Title must be between 1 and 255 characters'
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Location cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'Location must be between 1 and 255 characters'
        }
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'Longitude must be a valid decimal number'
        },
        min: {
          args: [-180],
          msg: 'Longitude must be between -180 and 180'
        },
        max: {
          args: [180],
          msg: 'Longitude must be between -180 and 180'
        }
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'Latitude must be a valid decimal number'
        },
        min: {
          args: [-90],
          msg: 'Latitude must be between -90 and 90'
        },
        max: {
          args: [90],
          msg: 'Latitude must be between -90 and 90'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "Stage",
    timestamps: true,
    validate: {
      // Model-level validation
      paymentLogicValidation() {
        // If payment status is PAID, amount and date should be present
        if (this.paymentStatus === 'PAID') {
          if (!this.amountPaid) {
            throw new Error('Amount paid is required when payment status is PAID');
          }
          if (!this.paymentDate) {
            throw new Error('Payment date is required when payment status is PAID');
          }
        }
        
        // If payment status is NO_PAYMENT_REQUIRED, amount and date should not be present
        if (this.paymentStatus === 'NO_PAYMENT_REQUIRED') {
          if (this.amountPaid) {
            throw new Error('Amount paid should not be set when no payment is required');
          }
          if (this.paymentDate) {
            throw new Error('Payment date should not be set when no payment is required');
          }
          if (this.feeName) {
            throw new Error('Fee name should not be set when no payment is required');
          }
        }
      }
    }
  }
)

Shipment.hasMany(Stage, {
  foreignKey: "shipmentId",
  as: "stages", // Changed to lowercase for consistency
})

Stage.belongsTo(Shipment, {
  foreignKey: "shipmentId",
  as: "shipment",
})