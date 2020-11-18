import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  todoForm: FormGroup
  minDate = new Date()
  priorities = ['low', 'medium', 'high']

  @Output() emitTodo = new EventEmitter()

  constructor(fb: FormBuilder) {
    this.todoForm = fb.group({
      des: fb.control('', [Validators.required]),
      priority: fb.control('', [Validators.required]),
      due: fb.control('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  //shorthand for form obj
  get f() {
    return this.todoForm
  }

  processForm() {
    console.log(this.todoForm.value)
    this.emitTodo.next(this.todoForm.value)
    this.todoForm.reset()
  }

}
