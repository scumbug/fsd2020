import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class getJikan {
  ENDPOINT = 'https://api.jikan.moe/v3/search/';

  constructor(private http: HttpClient) {}

  async searchAnime(q: string) {
    return await this.http
      .get(`${this.ENDPOINT}anime?q=${q}&rated=pg13`)
      .toPromise();
  }
}
