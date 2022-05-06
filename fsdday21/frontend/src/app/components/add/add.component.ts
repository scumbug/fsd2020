import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FetchService } from 'src/app/fetch.service';
import { Rsvp } from 'src/interface';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  rsvpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private backend: FetchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rsvpForm = this.fb.group({
      name: this.fb.control(''),
      email: this.fb.control(''),
      phone: this.fb.control(''),
      status: this.fb.control(''),
      createdBy: 1,
      createdDt: new Date(),
    });
  }

  onSubmit(): void {
    this.backend.addRsvp(this.rsvpForm.value as Rsvp);
    this.router.navigate(['/']);
  }
}
