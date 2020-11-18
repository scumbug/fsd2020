import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'csfws3';

  todos = []

  addTodo(todo) {
    this.todos.push(todo)
  }

  deleteTodo(idx) {
    this.todos.splice(idx,1)
  }
}
