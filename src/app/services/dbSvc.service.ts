import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { SearchQuery } from '../models/searchquery.model';

@Injectable()
export class dbSvc extends Dexie {
  private history: Dexie.Table<SearchQuery, number>;

  constructor() {
    super('jikandb');
    //q to be indexed
    this.version(1).stores({
      history: '++id,q',
    });

    this.history = this.table('history');
  }

  async addTitle(t: SearchQuery): Promise<any> {
    t.q = t.q.trim().toLowerCase();
    return await this.history.add(t);
  }

  async listSearch(): Promise<SearchQuery[]> {
    return await this.history.toArray();
  }
}
