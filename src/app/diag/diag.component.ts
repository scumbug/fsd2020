import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { todo } from '../interfaces/todo.interface'

@Component({
  selector: 'app-diag',
  templateUrl: './diag.component.html',
  styleUrls: ['./diag.component.css']
})
export class DiagComponent {

  constructor(public dialogRef: MatDialogRef<DiagComponent>,
    @Inject(MAT_DIALOG_DATA) public todo: todo) { }

  @Output() todoForwarder = new EventEmitter()

  forwardTodo(event) {
    this.todoForwarder.next(event)
  }


}
