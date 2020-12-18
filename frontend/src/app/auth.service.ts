import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cred } from './models';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  async login(cred: Cred): Promise<number> {
    // Auth logic here
    const body = JSON.stringify(cred);
    console.log(cred);
    const status = await this.http
      .post<any>('/auth', body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .toPromise();
    return 0;
  }
}
