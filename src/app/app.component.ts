import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { item } from './item.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'csfcrud';
  data: item[];
  item: item;
  id: number;
  next: number;

  constructor(private cartSvc: CartService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.data = await this.cartSvc.getCart();
      this.next = this.data.length + 1;
    } catch (e) {
      console.log('get item error');
    }
  }

  async editItem(id: number) {
    try {
      this.item = await this.cartSvc.getItem(id);
    } catch (e) {
      console.log('edit item error');
    }
  }

  async updateCart($event: item) {
    try {
      await this.cartSvc.updateCart($event);
      this.data = await this.cartSvc.getCart();
      this.next = this.data.length + 1;
    } catch (e) {
      console.log('error sending data');
    }
  }

  async deleteCart($event: item) {
    try {
      await this.cartSvc.deleteCart($event.id);
      this.data = await this.cartSvc.getCart();
      this.next = this.data.length + 1;
    } catch (e) {
      console.log('unable to delete');
    }
  }
}
