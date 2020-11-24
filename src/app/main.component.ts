import { Component, OnInit } from '@angular/core';
import { TodoSummary } from './models.interface';
import { TodoDatabase } from './todo.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  todos: TodoSummary[] = [];

  constructor(private db: TodoDatabase) {}

  ngOnInit(): void {
    this.db.getTodoSummary().then((result) => {
      this.todos = result;
      console.log(result);
    });
  }
}
