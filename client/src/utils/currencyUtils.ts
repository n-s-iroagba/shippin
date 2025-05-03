
const CRYPTO_RATES = {
  BTC: 0.000037,
  ETH: 0.00055,
  USDT: 1
};

export const convertUSDToCrypto = (usdAmount: number, cryptoType: string): string => {
  const rate = CRYPTO_RATES[cryptoType as keyof typeof CRYPTO_RATES];
  if (!rate) return '0';
  return (usdAmount * rate).toFixed(8);
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
