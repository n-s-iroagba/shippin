import { AppError } from "../utils/error/errorClasses";

export const validateCryptoWalletCreation = (data: any) => {
  if (!data.currency) {
    throw new AppError(400, "Currency is required");
  }
  if (!data.walletAddress) {
    throw new AppError(400, "Wallet address is required");
  }
  if (typeof data.currency !== "string") {
    throw new AppError(400, "Currency must be a string");
  }
  if (typeof data.walletAddress !== "string") {
    throw new AppError(400, "Wallet address must be a string");
  }
  if (data.currency.length < 2 || data.currency.length > 10) {
    throw new AppError(400, "Currency must be between 2 and 10 characters");
  }
  if (data.walletAddress.length < 10 || data.walletAddress.length > 100) {
    throw new AppError(400, "Wallet address must be between 10 and 100 characters");
  }
};

export const validateCryptoWalletUpdate = (data: any) => {
  if (data.currency && typeof data.currency !== "string") {
    throw new AppError(400, "Currency must be a string");
  }
  if (data.walletAddress && typeof data.walletAddress !== "string") {
    throw new AppError(400, "Wallet address must be a string");
  }
  if (data.currency && (data.currency.length < 2 || data.currency.length > 10)) {
    throw new AppError(400, "Currency must be between 2 and 10 characters");
  }
  if (data.walletAddress && (data.walletAddress.length < 10 || data.walletAddress.length > 100)) {
    throw new AppError(400, "Wallet address must be between 10 and 100 characters");
  }
}; 