// src/app/services/suite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import { Suite } from "./models/suite";

@Injectable({
  providedIn: 'root'
})
export class SuiteService {
  private apiUrl = `${environment.apiUrl}/api/suites`;
  constructor(private http: HttpClient) {}
  getSuites(): Observable<Suite[]> {
    return this.http.get<Suite[]>(this.apiUrl);
  }
  getSuiteById(id: number): Observable<Suite> {
    return this.http.get<Suite>(`${this.apiUrl}/${id}`);
  }
  createSuite(suite: Suite): Observable<Suite> {
    return this.http.post<Suite>(this.apiUrl, suite);
  }
  updateSuite(id: number, suite: Suite): Observable<Suite> {
    return this.http.put<Suite>(`${this.apiUrl}/${id}`, suite);
  }
  deleteSuite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
