import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CameraService } from '../camera.service';
import { FoodForThought } from '../models';
import { FormService } from '../form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  fftForm: FormGroup;
  formData: FormData;

  imagePath = '/assets/cactus.png';

  constructor(
    private cameraSvc: CameraService,
    private fb: FormBuilder,
    private auth: AuthService,
    private formSvc: FormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get selfie
    if (this.cameraSvc.hasImage()) {
      const img = this.cameraSvc.getImage();
      this.imagePath = img.imageAsDataUrl;
    }
    // Init form
    this.fftForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      comments: this.fb.control('', [Validators.required]),
      imageCheck: this.fb.control(this.cameraSvc.hasImage(), [
        Validators.requiredTrue,
      ]),
      cred: this.auth.getCred(),
    });
    // Restore save state of form data if any
    if (this.formSvc.getForm() != null) {
      const savedForm = this.formSvc.getForm();
      this.fftForm.get('title').setValue(savedForm.title);
      this.fftForm.get('comments').setValue(savedForm.comments);
    }
  }

  // Save form state and navigate to take a selfie
  capture() {
    this.formSvc.saveForm(this.fftForm.value);
    this.router.navigate(['/', 'capture']);
  }

  clear() {
    this.imagePath = '/assets/cactus.png';
    this.fftForm.reset();
  }

  async onSubmit() {
    //build object to be sent to backend
    const data = new FormData();
    data.set('upload', this.cameraSvc.getImage().imageData);
    data.set('form', JSON.stringify(this.fftForm.value));
    const res = await this.formSvc.processForm(data);
    if (res.status == 200) {
      this.clear();
    }
  }
}
