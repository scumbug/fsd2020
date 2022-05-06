import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchQuery } from 'src/app/models/searchquery.model';
import { dbSvc } from 'src/app/services/dbSvc.service';
import { getJikan } from 'src/app/services/getJikan.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jikan: getJikan,
    private db: dbSvc,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      q: this.fb.control('', [Validators.required]),
      type: this.fb.control('anime', [Validators.required]),
    });
  }

  async show() {
    console.log(this.searchForm.value);
  }

  goToResult() {
    this.router.navigate([
      'search',
      this.searchForm.get('type').value,
      this.searchForm.get('q').value,
    ]);
  }

  saveSearch() {
    this.db.addTitle(this.searchForm.value as SearchQuery);
    this.goToResult();
  }
}
