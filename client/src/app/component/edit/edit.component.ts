import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/app/models.interface';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  editTodo: Todo;
  create: boolean;
  @ViewChild('edit')
  edit: FormComponent;
  constructor(
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

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

  async onClick(): Promise<void> {
    await this.edit.addTodo();
    this.router.navigate(['/']);
  }
}
