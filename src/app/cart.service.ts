import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { item } from './item.interface';

@Injectable()
export class CartService {
  constructor(private http: HttpClient) {}

  async getCart(): Promise<item[]> {
    return await this.http
      .get<item[]>('http://localhost:3000/cart')
      .toPromise();
  }

  async getItem(id: number): Promise<item> {
    return await this.http
      .get<item>(`http://localhost:3000/cart/${id}`)
      .toPromise();
  }

  async deleteCart(id: number): Promise<any> {
    return await this.http
      .delete<any>(`http://localhost:3000/cart/${id}`)
      .toPromise();
  }

  async updateCart(item: item): Promise<any> {
    return await this.http
      .put<any>(`http://localhost:3000/cart/${item.id}`, item)
      .toPromise();
  }
}
