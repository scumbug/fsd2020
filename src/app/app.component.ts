import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'csfws3';

  //storage for lists of todos
  todos = []

  //var for todo to be edited to pass to form.compo
  todo: any

  //push new todo into todos array
  addTodo(todo) {
    this.todos.push(todo)
  }

  //delete selected todo
  deleteTodo(idx) {
    this.todos.splice(idx, 1)
  }

  //load todo to be edited into todo variable
  editTodo(idx) {
    this.todo = this.todos[idx]
    this.todo.idx = idx
  }

  //update todo that was edited and close modal
  updateTodo(todo) {
    this.todos[todo.idx] = todo
    document.getElementById('closemodal').click()
  }

}
