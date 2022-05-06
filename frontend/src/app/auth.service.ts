import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cred, HttpRes } from './models';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  cred: Cred;

  async login(cred: Cred): Promise<HttpRes> {
    const body = JSON.stringify(cred);
    try {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const message = await this.http
        .post<any>('/auth', body, { headers })
        .toPromise();
      this.cred = cred;
      return { status: 200, ...message };
    } catch (e) {
      return { status: e.status, message: e.error.message } as HttpRes;
    }
  }

  getCred(): Cred {
    return this.cred;
  }
}
