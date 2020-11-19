import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { todo } from '../interfaces/todo.interface'

@Component({
  selector: 'app-diag',
  templateUrl: './diag.component.html',
  styleUrls: ['./diag.component.css']
})
export class DiagComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public todo: todo) { }

}
