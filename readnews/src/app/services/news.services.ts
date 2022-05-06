import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../models/models.interface';
import { dbSvc } from './db.service';

@Injectable()
export class newsAPI {
  constructor(private http: HttpClient, private db: dbSvc) {}

  ENDPOINT = 'https://newsapi.org/v2/top-headlines';

  //simple GET call
  async getNews(cc: string): Promise<Article[]> {
    const APIKEY = await this.db.getKey();
    const params = new HttpParams()
      .set('apiKey', APIKEY)
      .append('category', 'general')
      .append('country', cc)
      .append('pageSize', '30');
    const res = await this.http
      .get<any>(this.ENDPOINT, { params: params })
      .toPromise();
    return res.articles.map((article) => {
      return article;
    });
  }
}
