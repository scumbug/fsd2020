import { Component, Input, OnInit } from '@angular/core';
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

  @Input()
  get todo(): Todo {
    const t: Todo = this.todoForm.value as Todo;
    t.tasks = t.tasks.map((v) => {
      //@ts-ignore
      v.priority = parseInt(v.priority);
      return v;
    });
    return t;
  }

  set todo(t: Todo) {
    if (t) {
      //patch in id and title
      this.todoForm.patchValue({
        id: t.id,
        title: t.title,
      });

      //patch in tasks
      t.tasks.forEach((task) => {
        console.log(task);
        this.tasksArray.push(
          this.fb.group({
            description: task.description,
            priority: task.priority.toString(),
          })
        );
      });
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.createTodo();
    //this.tasksArray = this.todoForm.get('tasks') as FormArray; //alternative to creating FormArray inside form generator
  }

  private createTodo(todo: Todo = null): FormGroup {
    this.tasksArray = this.fb.array([]);
    return this.fb.group({
      id: this.fb.control(todo?.id),
      title: this.fb.control(todo?.title, [Validators.required]),
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
