import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FoodForThought, HttpRes } from './models';

@Injectable()
export class FormService {
  constructor(private http: HttpClient, private router: Router) {}

  fftForm: FoodForThought;

  getForm(): FoodForThought {
    return this.fftForm;
  }

  async processForm(data): Promise<HttpRes> {
    try {
      const headers = new HttpHeaders().set(
        'Content-Type',
        'multipart/form-data'
      );
      const res = await this.http.post<any>('/submit', data).toPromise();
      return { status: 200, ...res } as HttpRes;
    } catch (e) {
      if (e.status == 401) {
        // Not authenticated, redirect to login again
        this.router.navigate(['/']);
        return { status: 401, message: 'Naughty naughty!' };
      } else {
        console.log(e);
      }
    }
  }
}
