import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  todoForm: FormGroup
  minDate = new Date()
  priorities = ['low', 'medium', 'high']
  editDes: String
  editPriority: String
  editIdx: Number

  @Input() todo: any
  @Output() emitTodo = new EventEmitter()

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

  ngOnChanges(): void {
    if(this.todo !== undefined) {
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

  processForm() {
    if(this.editIdx != undefined) {
      this.todoForm.controls.idx.setValue(this.editIdx)
    }
    this.emitTodo.next(this.todoForm.value)
    this.todoForm.reset()
  }

}
