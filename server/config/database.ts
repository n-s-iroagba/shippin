import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Initialize Sequelize instance for MySQL
export const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Database name
  process.env.DB_USER as string, // Database user
  process.env.DB_PASS as string, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: "mysql",
    logging: false, // Set to true for SQL logging
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test database connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};
