import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../models/models.interface';

@Injectable()
export class countryAPI {
  constructor(private http: HttpClient) {}

  countryList: Country[];

  ENDPOINT = 'https://restcountries.eu/rest/v2/alpha';
  acceptedCC: string = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'
    .split(' ')
    .join(';');

  //simple GET call
  async getCountries(): Promise<Country[]> {
    const params = new HttpParams().set('codes', this.acceptedCC);
    const res = await this.http
      .get<any[]>(this.ENDPOINT, { params: params })
      .toPromise();
    return res.map((country) => {
      return {
        name: country.name,
        code: country.alpha2Code,
        flag: country.flag,
      };
    });
  }
}
