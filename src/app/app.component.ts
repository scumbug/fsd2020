import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    try {
      this.data = await this.http
        .get<item[]>('http://localhost:3000/cart')
        .toPromise();
    } catch (e) {
      console.log('error retrieving data');
    }
  }

  async editItem(id: number) {
    try {
      this.item = await this.http
        .get<item>(`http://localhost:3000/cart/${id}`)
        .toPromise();
    } catch (e) {
      console.log('error retrieving data');
    }
  }

  async updateCart($event: item) {
    try {
      await this.http
        .put<any>(`http://localhost:3000/cart/${$event.id}`, $event)
        .toPromise();

      this.data = await this.http
        .get<item[]>('http://localhost:3000/cart')
        .toPromise();
    } catch (e) {
      console.log('error sending data');
    }
  }
}
