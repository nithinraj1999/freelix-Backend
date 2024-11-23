export interface IWallet {
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  walletHistory: Array<{
    date: Date;
    amount: number;
    type: 'Credit' | 'Debit';
    description: string;
  }>;
}
