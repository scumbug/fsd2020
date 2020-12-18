import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRes } from './models';

@Injectable()
export class FormService {
  constructor(private http: HttpClient, private router: Router) {}

  fftForm: any;

  getForm() {
    return this.fftForm;
  }

  saveForm(data) {
    this.fftForm = data;
  }

  async processForm(data): Promise<HttpRes> {
    try {
      const res = await this.http.post<any>('/submit', data).toPromise();
      return { status: 200, ...res } as HttpRes;
    } catch (e) {
      if (e.status == 401) {
        // Not authenticated, redirect to login again
        this.router.navigate(['/']);
        return {
          status: 401,
          message: 'Naughty naughty! You should already have been auth-ed',
        };
      } else {
        // Log other errors
        console.log(e);
      }
    }
  }
}
