export interface ReservationWithClientDto {
  id?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  paymentStatus?: string;
  reservationSource?: string;
  numberOfGuests?: number;
  dateCreated?: string;
  clientId?: number;
  suiteId?: number;
  suiteDescription?: string;

  // Champs liés au paiement 🔥
  paymentId?: number;
  amount?: number;
  transactionId?: string;
  paymentDate?: string;
}
