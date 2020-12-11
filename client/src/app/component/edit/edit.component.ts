import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from 'src/app/models.interface';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  editTodo: Todo;
  create: boolean;
  constructor(private http: HttpClient, private actRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.create = false;
    this.getTodo(this.actRoute.snapshot.params['id']).then((res) => {
      this.editTodo = res;
    });
  }

  async getTodo(id: number): Promise<Todo> {
    return await this.http
      .get<Todo>(`http://localhost:3000/todo/${id}`)
      .toPromise();
  }
}
