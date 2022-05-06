import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  orderForm: FormGroup;
  orderDetails: FormArray;
  employees: any[];
  customers: any[];
  shippers: any[];
  status: any[];
  products: any[];
  formData: FormData;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    //init form
    this.orderDetails = this.fb.array([]);
    this.orderForm = this.fb.group({
      employee_id: this.fb.control(''),
      customer_id: this.fb.control(''),
      shipper_id: this.fb.control(''),
      status_id: this.fb.control(''),
      orderDetails: this.orderDetails,
    });

    //load dropdown boxes
    this.getData('employees').then((res) => (this.employees = res));
    this.getData('customers').then((res) => (this.customers = res));
    this.getData('shippers').then((res) => (this.shippers = res));
    this.getData('status').then((res) => (this.status = res));
    this.getData('products').then((res) => (this.products = res));
  }

  private createProduct(): FormGroup {
    return this.fb.group({
      product_id: this.fb.control(''),
      quantity: this.fb.control(''),
      unit_price: this.fb.control(''),
      status_id: 0,
    });
  }

  async getData(method: string) {
    return await this.http
      .get<any>(`http://localhost:3000/api/${method}`)
      .toPromise();
  }

  addProduct(): void {
    this.orderDetails.push(this.createProduct());
  }

  deleteProduct(i: number): void {
    this.orderDetails.removeAt(i);
  }

  getPrice(product: string) {}

  onSubmit() {
    console.log(JSON.stringify(this.orderForm.value));
    this.http
      .post('http://localhost:3000/order', this.orderForm.value, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .toPromise();
  }
}
