import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  //init variables
  todoForm: FormGroup
  editDes: String
  editPriority: String
  editIdx: Number

  //declare dates and hard code priority radio button
  minDate = new Date()
  priorities = ['low', 'medium', 'high']

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

  ngOnInit(): void {
  }

  //on modal opens, set default values to the todo that is to be edited
  ngOnChanges(): void {
    if (this.todo !== undefined) {
      this.editDes = this.todo.des
      this.editPriority = this.todo.priority
      this.editIdx = this.todo.idx
      this.todoForm.controls.due.setValue(this.todo.due)
    }
  }

  //shorthand for form obj
  get f() {
    return this.todoForm
  }

  //process and fire form data to parent
  processForm() {
    if (this.editIdx != undefined) {
      this.todoForm.controls.idx.setValue(this.editIdx)
    }
    this.emitTodo.next(this.todoForm.value)
    this.todoForm.reset()
  }

}
