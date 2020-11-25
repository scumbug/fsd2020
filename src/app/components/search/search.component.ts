import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getJikan } from 'src/app/services/getJikan.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private jikan: getJikan) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      type: this.fb.control('anime', [Validators.required]),
    });
  }

  async show() {
    console.log(await this.jikan.searchAnime('bleach'));
  }
}
