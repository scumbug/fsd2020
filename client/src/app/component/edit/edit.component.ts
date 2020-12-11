import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  create: boolean;
  constructor() {}

  ngOnInit(): void {
    this.create = false;
  }
}
