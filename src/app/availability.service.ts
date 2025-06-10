import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';  // HttpClient et HttpParams sont nécessaires pour les requêtes HTTP
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  // URL de ton API backend Spring Boot
  private baseUrl = 'http://localhost:8080/api/reservations/availability/by-name';

  constructor(private http: HttpClient) { }

  // Méthode pour vérifier la disponibilité en envoyant une requête GET avec des paramètres
  checkAvailability(suiteDescription: string, startDate: string, endDate: string, numberOfGuests: number): Observable<boolean> {
    const params = new HttpParams()
      .set('suiteDescription', suiteDescription)
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('numberOfGuests', numberOfGuests.toString());  // Utilisation de HttpParams pour envoyer les paramètres

    return this.http.get<boolean>(this.baseUrl, { params });  // Appel à l'API GET
  }
}
