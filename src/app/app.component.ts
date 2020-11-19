import { Component } from '@angular/core';
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
  todos = JSON.parse(localStorage.getItem('todoSor')) || []
  //var for todo to be edited to pass to form.compo
  todo: todo

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
  }

  //update todo that was edited and close modal
  updateTodo(todo) {
    this.todos[todo.idx] = todo
    localStorage.setItem('todoStor', JSON.stringify(this.todos));
    document.getElementById('closemodal').click()
  }

}
