import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Totals } from 'model.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  ENDPOINT: string = 'http://localhost:3000/order/total';
  form: FormGroup;
  result: Totals;
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      q: this.fb.control(''),
    });
  }

  async onSubmit() {
    this.result = await this.getResults(this.form.get('q').value);
  }

  async getResults(orderID: string): Promise<Totals> {
    const [data] = await this.http
      .get<Totals[]>(`${this.ENDPOINT}/${orderID}`)
      .toPromise();
    return data;
  }
}
