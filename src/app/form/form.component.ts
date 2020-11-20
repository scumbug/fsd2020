import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { order } from '../interfaces/order.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  //declare variables
  orderForm: FormGroup;
  order: order;
  custAddr: string;
  ageCheck: moment.Moment;
  today: Date;
  gender: string[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.today = new Date();
    this.ageCheck = moment(this.today).subtract(21, 'years');
    this.custAddr = 'mybitcoinaddress';

    this.orderForm = this.fb.group({
      phone: this.fb.control('', [
        Validators.required,
        Validators.pattern(
          '[6|8|9]\\d{7}|\\+65[6|8|9]\\d{7}|\\+65\\s[6|8|9]\\d{7}'
        ),
      ]),
      name: this.fb.control('', [Validators.required]),
      gender: this.fb.control(''),
      dob: this.fb.control('', [Validators.required]),
      orderDate: this.fb.control(new Date()),
      orderType: this.fb.control('', [Validators.required]),
      quantity: this.fb.control('', [Validators.required]),
      cryptoPair: this.fb.control('SGDBTC'),
      pairPrice: this.fb.control(10000),
      qrCode: this.fb.control({ value: '', disabled: true }, [
        Validators.required,
      ]),
    });
  }

  //form getter shorthand
  get f() {
    return this.orderForm;
  }

  processOrder(event) {
    console.log(this.orderForm.value);
  }

  copyClipboard(copy) {
    console.log('copy to clipboard');
  }
}
