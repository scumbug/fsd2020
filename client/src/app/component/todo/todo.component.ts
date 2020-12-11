import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from 'src/app/models.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todos: Todo[];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Todo[]>('http://localhost:3000/todos')
      .toPromise()
      .then((res) => (this.todos = res));
  }

  onCreate() {
    this.router.navigate(['/create']);
  }

  onEdit() {}

  async onDelete(id: number, i: number) {
    await this.http.get(`http://localhost:3000/delete/${id}`).toPromise();
    this.todos.splice(i, 1);
    console.log(this.todos);
  }
}
