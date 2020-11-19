import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  //declare variables
  todoForm: FormGroup
  minDate: Date
  priorities: String[]

  //setup listener for editing todos and emitter for firing data back to parent
  @Input() todo: any
  @Output() emitTodo = new EventEmitter()

  //construct form model
  constructor(fb: FormBuilder) {
    this.todoForm = fb.group({
      des: fb.control('', [Validators.required]),
      priority: fb.control('', [Validators.required]),
      due: fb.control('', [Validators.required]),
      idx: fb.control(undefined)
    })
  }

  //init variables
  ngOnInit(): void {
    this.minDate = new Date()
    this.priorities = ['low', 'medium', 'high']
  }

  //on modal opens, set default values to the todo that is to be edited
  ngOnChanges(): void {
    if (this.todo !== undefined) {
      this.todoForm.controls.due.setValue(this.todo.due)
    }
  }

  //shorthand for form obj
  get f() {
    return this.todoForm
  }

  //process and fire form data to parent
  processForm(event) {
    if (this.todo != undefined) {
      this.todoForm.controls.idx.setValue(this.todo.idx)
    }
    this.emitTodo.next(this.todoForm.value)
    this.todoForm.reset()
    //workaround for this bug https://github.com/angular/components/issues/4190
    event.currentTarget.reset()
  }

}
