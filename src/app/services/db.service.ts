import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Article, Country } from '../models/models.interface';

@Injectable()
export class dbSvc extends Dexie {
  private countries: Dexie.Table<Country>;
  private key: Dexie.Table<ApiKey, string>;
  private articles: Dexie.Table<Article, number>;

  constructor() {
    super('readnews');
    //id to be indexed
    this.version(1).stores({
      key: 'name',
      countries: 'code',
      articles: '++id,country,saveFlag,cacheTime',
    });
    this.key = this.table('key');
    this.countries = this.table('countries');
    this.articles = this.table('articles');
  }

  //
  // Key Table functions
  //

  //save key to db
  async saveKey(key: ApiKey) {
    return await this.key.put(key);
  }

  async deleteKey() {
    return await this.key.delete('newsapi');
  }

  async hasKey(): Promise<boolean> {
    return (await this.key.get('newsapi')) != null;
  }

  async getKey(): Promise<string> {
    return (await this.key.get('newsapi')).key;
  }

  //
  // Countries Table functions
  //

  //add countries to DB
  async saveCountries(data: Country[]) {
    return await this.countries.bulkAdd(data);
  }

  async haveCountries(): Promise<boolean> {
    return (await this.countries.count()) != 0;
  }

  async getCountries(): Promise<Country[]> {
    return await this.countries.toArray();
  }

  //
  // Article Table functions
  //

  async saveArticles(data: Article[]) {
    //handle dupcheck logic
    return await this.articles.bulkAdd(data);
  }

  async getArticles(cc: string): Promise<Article[]> {
    return await this.articles
      .where('country')
      .equals(cc)
      .and((article) => {
        return (
          article.cacheTime.getTime() > new Date().getTime() - 5 * 60 * 1000 ==
          true
        );
      })
      .toArray();
  }

  async haveArticles(cc): Promise<boolean> {
    return (await this.articles.where('country').equals(cc).count()) != 0;
  }

  async checkCache(cc): Promise<boolean> {
    const res = await this.articles
      .where('country')
      .equals(cc)
      .and((article) => article.saveFlag == 0)
      .toArray();
    //check cache time 5*60*1000 = 5mins
    const now = new Date();
    const cache = res[0]['cacheTime'];
    if (new Date().getTime() - cache.getTime() < 5 * 60 * 1000) {
      return true;
    } else {
      await this.articles
        .where('country')
        .equals(cc)
        .and((article) => article.saveFlag == 0)
        .delete();
      return false;
    }
  }
}
