import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component';
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

  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    //init variables
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
      orderDate: this.fb.control(this.today),
      orderType: this.fb.control('', [Validators.required]),
      quantity: this.fb.control('', [
        Validators.required,
        Validators.pattern('[0-9]+(\\.[0-9]+)?'),
      ]),
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

  confirmDialog(): void {
    //dialog message
    const message = `You are about to ${this.f.get('orderType').value} ${
      this.f.get('quantity').value
    } of BTC, please confirm`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((res) => {
      //logic here upon dialog yes/no
      if (res) {
        this.processOrder('test');
      }
    });
  }
}
