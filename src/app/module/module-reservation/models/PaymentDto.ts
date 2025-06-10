export interface PaymentDto {
  amount: number;
  transactionId: string;
  paymentDate: string;
  currency?: string;
  statuts?: string;
}
