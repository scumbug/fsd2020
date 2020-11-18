import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  todoForm: FormGroup
  @Output() emitTodo = new EventEmitter()

  constructor(fb: FormBuilder) {
    this.todoForm = fb.group({
      des: fb.control(''),
      priority: fb.control(''),
      due: fb.control(new Date())
    })
   }

  ngOnInit(): void {
  }

  processForm() {
    console.log(this.todoForm.value)
    this.emitTodo.next(this.todoForm.value)
    this.todoForm.reset()
  }

}
