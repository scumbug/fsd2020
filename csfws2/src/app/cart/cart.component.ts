import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //instantiate empty cart
  @Input() cart: any[];

  //instantiate eventemitter
  @Output() deleteCartItem = new EventEmitter();

  //fire an event to parent to delete cart item
  deleteItem(key) {
    this.deleteCartItem.next(key);
  }

}
