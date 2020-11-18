import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'csfws3';

  todos = []
  todo: any

  addTodo(todo) {
    if(todo.editIdx == undefined){
      this.todos.push(todo)
    } else {
      this.todos[todo.editIdx] = todo
    }
  }

  deleteTodo(idx) {
    this.todos.splice(idx,1)
  }
  
  editTodo(idx) {
    this.todo=this.todos[idx]
    this.todo.idx=idx
  }

  updateTodo(todo) {
    console.log(todo)
    this.todos[todo.idx] = todo
    document.getElementById('closemodal').click()
  }

}
