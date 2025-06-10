import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Reservation} from './models/reservation';
import {ReservationWithClientDto} from './models/ReservationWithClientDto.model';


@Injectable({ providedIn: 'root' })
export class ReservationService {
  private baseUrl = 'http://localhost:8080/api/reservations';
  private apiUrlNewClient = 'http://localhost:8080/api/reservations/reservations/new-client';
  constructor(private http: HttpClient) {}

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, reservation);
  }
  createReservationWithNewClient(dto: ReservationWithClientDto): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrlNewClient, dto);
  }
  checkAvailabilityBooking(
    suiteName: string,
    checkin: string,
    checkout: string,
    adults: number,
    children: number = 0,
    rooms: number = 1
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('checkin', checkin)
      .set('checkout', checkout)
      .set('adults', adults.toString())
      .set('children', children.toString())
      .set('rooms', rooms.toString())
      .set('suiteName', suiteName);

    return this.http.get<boolean>('http://localhost:8080/api/rooms/check-availability', { params });
  }
  checkAvailability(
    suiteDescription: string,
    startDate: string,
    endDate: string,
    numberOfGuests: number
  ): Observable<boolean | string> {  // accepter bool ou string
    const params = new HttpParams()
      .set('suiteDescription', suiteDescription)
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('numberOfGuests', numberOfGuests.toString());

    return this.http.get<boolean | string>('http://localhost:8080/api/reservations/availability/by-name', { params });
  }
}
