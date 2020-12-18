import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CameraService } from '../camera.service';
import { FoodForThought } from '../models';
import { FormService } from '../form.service';

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
    private formSvc: FormService
  ) {}

  ngOnInit(): void {
    if (this.cameraSvc.hasImage()) {
      const img = this.cameraSvc.getImage();
      this.imagePath = img.imageAsDataUrl;
    }
    this.fftForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      comments: this.fb.control('', [Validators.required]),
      imageCheck: this.fb.control(this.cameraSvc.hasImage(), [
        Validators.requiredTrue,
      ]),
      cred: this.auth.getCred(),
    });
  }

  clear() {
    this.imagePath = '/assets/cactus.png';
    //this.fftForm.get('imageCheck').setValue(false);
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
