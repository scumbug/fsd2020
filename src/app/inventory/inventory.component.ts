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
  addCart($event,item){
    this.notifyApp.next(item);
  }
}
