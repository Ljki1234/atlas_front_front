export interface BookingDetails {
  hotelName: string;
  hotelRating: number;
  hotelAddress: string;
  hotelImage: string;
  checkInDate: string;
  checkOutDate: string;
  checkInDay: string;
  checkOutDay: string;
  nightCount: number;
  guestCount: number;
  roomName: string;
  roomFeatures: string[];
  roomPrice: number;
  vatPercentage: number;
  vatAmount: number;
  cityTax: number;
  totalPrice: number;
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  selected?: boolean;
}

export interface ArrivalTimeOption {
  value: string;
  label: string;
}

export interface ProgressStep {
  number: number;
  label: string;
  completed: boolean;
  active: boolean;
}