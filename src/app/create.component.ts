import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TodoComponent } from './todo.component';
import { TodoDatabase } from './todo.database';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @ViewChild('myTodo')
  todoRef: TodoComponent;

  constructor(private db: TodoDatabase, private router: Router) {}

  ngOnInit(): void {}

  addTodo() {
    this.todoRef.todo.id = uuidv4().toString().substring(0, 8);
    this.db.addTodo(this.todoRef.todo);
    this.router.navigate(['/']);
  }
}
