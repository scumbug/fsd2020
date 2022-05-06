import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rsvp } from 'src/interface';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  ENDPOINT = 'http://localhost:3000/api/rsvp';
  constructor(private http: HttpClient) {}

  async getRsvp(): Promise<Rsvp[]> {
    const res = await this.http.get<Rsvp[]>(this.ENDPOINT).toPromise();
    return res;
  }

  async addRsvp(data: Rsvp): Promise<any> {
    const res = await this.http.post<Rsvp>(this.ENDPOINT, data).toPromise();
    return res;
  }
}
