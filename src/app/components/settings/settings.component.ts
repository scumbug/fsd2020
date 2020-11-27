import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiKey } from 'src/app/models/models.interface';
import { dbSvc } from 'src/app/services/db.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  settings: FormGroup;
  keyStatus: boolean;
  constructor(
    private fb: FormBuilder,
    private db: dbSvc,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settings = this.fb.group({
      name: 'newsapi',
      key: this.fb.control('', [Validators.required]),
    });
    this.hasKey().then((bool) => (this.keyStatus = bool));
  }

  saveKey() {
    //save to DB and go to countries
    this.db.saveKey(this.settings.value as ApiKey);
    this.router.navigate(['/countries']);
  }

  deleteKey() {
    //delete API key
    this.db.deleteKey();
    this.keyStatus = false;
  }

  async hasKey() {
    return await this.db.hasKey();
  }
}
