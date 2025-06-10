import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingCheckService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8080/api/rooms';

  getAvailableRoomNames(
    checkin: string,
    checkout: string,
    adults: number,
    children: number,
    rooms: number
  ): Observable<string[]> {
    const params = new HttpParams()
      .set('checkin', checkin)
      .set('checkout', checkout)
      .set('adults', adults.toString())
      .set('children', children.toString())
      .set('rooms', rooms.toString());

    return this.http.get<string[]>(`${this.apiUrl}/available-room-names`, { params });
  }

}
