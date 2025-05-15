import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Use environment variables with fallback defaults
const dbName = process.env.DB_NAME || "shipping";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASS || "97chocho";
const dbHost = process.env.DB_HOST || "localhost";

// Initialize Sequelize instance for MySQL
export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "mysql",
  logging: false, // Set to true to see SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test database connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};
