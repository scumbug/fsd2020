import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { item } from '../item.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  //declare variables
  @Input() item: item;
  @Input() next: number;
  @Output() updateCart = new EventEmitter();
  @Output() deleteCart = new EventEmitter();
  crudForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.crudForm = this.createForm(this.item);
  }

  get f() {
    return this.crudForm;
  }

  //destructure form creation
  createForm(item: item): FormGroup {
    return this.fb.group({
      id: this.fb.control(item?.id || this.next),
      name: this.fb.control(item?.name),
      quantity: this.fb.control(item?.quantity),
    });
  }

  deleteItem() {
    this.deleteCart.next(this.crudForm.value as item);
    this.crudForm.reset();
    this.item = null;
  }

  addItem() {
    this.f.get('id').setValue(this.next);
    console.log(this.crudForm.value);
    console.log('add something');
  }

  updateItem() {
    if (this.f.get('id').value == null) {
      this.f.get('id').setValue(this.next);
    }
    this.updateCart.next(this.crudForm.value as item);
    this.crudForm.reset();
    this.item = null;
  }
}
