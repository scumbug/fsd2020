import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import bsCustomFileInput from 'bs-custom-file-input';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  create: boolean;
  @ViewChild('createTodo')
  createTodo: FormComponent;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.create = true;
    bsCustomFileInput.init();
  }

  async onClick(): Promise<void> {
    await this.createTodo.addTodo();
    this.router.navigate(['/']);
  }
}
