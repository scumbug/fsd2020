import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from './models.interface';
import { TodoComponent } from './todo.component';
import { TodoDatabase } from './todo.database';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css'],
})
export class TodoDetailComponent implements OnInit {
  @ViewChild('myTodo')
  todoRef: TodoComponent;

  todo: Todo;

  constructor(
    private db: TodoDatabase,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.todo = await this.db.getTodo(this.actRoute.snapshot.params['todoId']);
  }

  updateTodo() {
    this.db.addTodo(this.todoRef.todo);
    this.router.navigate(['/']);
  }

  deleteTodo() {
    this.db.deleteTodo(this.todoRef.todo);
    this.router.navigate(['/']);
  }
}
