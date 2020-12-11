import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Todo } from 'src/app/models.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  todoForm: FormGroup;
  tasksArray: FormArray;
  @Input() create: boolean; // true: create, false: edit
  @Input()
  set editTodo(t: Todo) {
    if (t) {
      this.todoForm.patchValue({
        id: t.id,
        title: t.title,
      });

      t.tasks.forEach((task) => {
        this.tasksArray.push(
          this.fb.group({
            description: this.fb.control(task.description),
            priority: this.fb.control(task.priority),
          })
        );
      });
    }
  }

  @ViewChild('upload') upload: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.todoForm = this.createForm();
  }

  createForm(): FormGroup {
    this.tasksArray = this.fb.array([]);
    return this.fb.group({
      title: this.fb.control(''),
      tasks: this.tasksArray,
    });
  }

  private createTask(): FormGroup {
    return this.fb.group({
      description: this.fb.control(''),
      priority: this.fb.control(-1),
    });
  }

  addTask(): void {
    this.tasksArray.push(this.createTask());
  }

  deleteTask(i: number): void {
    this.tasksArray.removeAt(i);
  }

  async addTodo(): Promise<void> {
    console.log(this.todoForm.value);
    //handle upload
    const data = new FormData();
    data.set('upload', this.upload.nativeElement.files[0]);
    data.set('form', JSON.stringify(this.todoForm.value));
    await this.http.post<any>('http://localhost:3000/submit', data).toPromise();
  }

  debug(): void {
    console.log(this.editTodo);
  }
}
