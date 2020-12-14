import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WineServiceService {
  constructor(private http: HttpClient) {}

  async getCountries(): Promise<any[]> {
    return this.http.get<any[]>('/countries').toPromise();
  }

  async getWines(country: string): Promise<any[]> {
    return this.http.get<any[]>(`/country/${country}`).toPromise();
  }
}
