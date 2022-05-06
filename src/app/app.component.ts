import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiagComponent } from './diag/diag.component';
import { todo } from './interfaces/todo.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'csfws3';

  //declare variables
  //storage for lists of todos
  todos = JSON.parse(localStorage.getItem('todoStor')) || []
  //var for todo to be edited to pass to form.compo
  @Input() todo: todo

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(DiagComponent, {
      data: this.todo
    });
    dialogRef.componentInstance.todoForwarder.subscribe( (res) => {
      this.updateTodo(res)
    }
    )
  }

  //push new todo into todos array
  addTodo(todo) {
    this.todos.push(todo)
    localStorage.setItem('todoStor', JSON.stringify(this.todos));
  }

  //delete selected todo
  deleteTodo(idx) {
    this.todos.splice(idx, 1)
    localStorage.setItem('todoStor', JSON.stringify(this.todos));
  }

  //load todo to be edited into todo variable
  editTodo(idx) {
    this.todo = this.todos[idx]
    this.todo.idx = idx
    this.openDialog()
  }

  //update todo that was edited and close modal
  updateTodo(todo) {
    this.todos[todo.idx] = todo
    localStorage.setItem('todoStor', JSON.stringify(this.todos));
  }

}
