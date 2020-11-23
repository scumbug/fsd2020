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
  @Output() updateCart = new EventEmitter();
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
      id: this.fb.control(item?.id),
      name: this.fb.control(item?.name),
      quantity: this.fb.control(item?.quantity),
    });
  }

  deleteItem(id: number) {
    console.log('delete something');
  }

  addItem(id: number) {
    console.log('add something');
  }

  updateItem(id: number) {
    this.updateCart.next(this.crudForm.value as item);
  }
}
