import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from './models.interface';
import { TodoDatabase } from './todo.database';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css'],
})
export class TodoDetailComponent implements OnInit {
  todo: Todo;

  constructor(private db: TodoDatabase, private actRoute: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.todo = await this.db.getTodo(this.actRoute.snapshot.params['todoId']);
  }
}
