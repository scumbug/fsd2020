import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from './models.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  tasksArray: FormArray;

  get todo(): Todo {
    const t: Todo = this.todoForm.value as Todo;
    t.tasks = t.tasks.map((v) => {
      //@ts-ignore
      v.priority = parseInt(v.priority);
      return v;
    });
    return t;
  }

  set todo(t: Todo) {}

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.createTodo();
    //this.tasksArray = this.todoForm.get('tasks') as FormArray; //alternative to creating FormArray inside form generator
  }

  private createTodo(): FormGroup {
    this.tasksArray = this.fb.array([]);
    return this.fb.group({
      id: this.fb.control(''),
      title: this.fb.control('', [Validators.required]),
      tasks: this.tasksArray,
    });
  }

  private createTask(): FormGroup {
    return this.fb.group({
      description: this.fb.control('', [Validators.required]),
      priority: this.fb.control(0),
    });
  }

  //add tasks as a FormGroup into the FormArray
  addTask(): void {
    this.tasksArray.push(this.createTask());
  }

  deleteTask(idx: number) {
    this.tasksArray.removeAt(idx);
  }

  processForm() {}
}
