
export interface CryptoWalletAttributes {
  id: number;
  adminId: number;
  currency: string;
  walletAddress: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCryptoWalletDto {
  currency: string;
  walletAddress: string;
  label?: string;
}

export interface UpdateCryptoWalletDto extends Partial<CreateCryptoWalletDto> {}
