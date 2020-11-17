import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //instantiate inventory for rendering
  @Input() inventory: any[];
  @Output() notifyApp = new EventEmitter<string>();

  //fire an event to parent to add item to cart
  //changed from passing in extra params to straight up traversing DOM to get product name
  addCart($event) {
    this.notifyApp.next($event.target.parentElement.firstChild.innerText)
  }
}
