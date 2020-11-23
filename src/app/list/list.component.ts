import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { item } from '../item.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  //declare variables
  @Input() data: item[];
  @Output() sendId = new EventEmitter<number>();
  itemList: string[];

  constructor() {}

  onClick(id: number) {
    this.sendId.next(id);
  }

  ngOnInit(): void {}
}
