import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  todoForm: FormGroup;
  tasksArray: FormArray;

  constructor(private fb: FormBuilder) {}

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
      priority: this.fb.control(0),
    });
  }

  addTask(): void {
    this.tasksArray.push(this.createTask());
  }

  deleteTask(i: number): void {
    this.tasksArray.removeAt(i);
  }
}
