import {PaymentDto} from './PaymentDto';

export interface Reservation {
  id?: number;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  reservationSource: string;
  dateCreated: string;
  status: string;
  client: {
    fullName: string;
    email: string;
    tel: string;
  };
  suite: {
    description: string;
  };
  payment?: PaymentDto;
}
