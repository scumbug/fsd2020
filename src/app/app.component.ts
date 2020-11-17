import { Component, EventEmitter, Input, Output } from '@angular/core';
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'day2ws';

  //hard coded dataset
  inventory = [
    { name: 'Egg', img: 'assets/egg.jpg', des: 'this is egg' },
    { name: 'Lettuce', img: 'assets/lettuce.jpg', des: 'this is lettuce' },
    { name: 'Rice', img: 'assets/rice.jpg', des: 'this is rice' },
    { name: 'Water', img: 'assets/water.jpg', des: 'this is water' },
    { name: 'Ham', img: 'assets/ham.jpg', des: 'this is ham' }
  ];

  //instantiate empty cart
  cart = new Map();

  //add items to cart
  pushToCart(item) {
    if(this.cart.has(item)){
      this.cart.set(item,this.cart.get(item)+1)
    } else {
      this.cart.set(item,1);
    }
    console.log(this.cart);
  }

  //delete cart items
  deleteMap(key) {
    this.cart.delete(key);
  }
}
