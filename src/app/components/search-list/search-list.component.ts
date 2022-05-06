import { Component, OnInit } from '@angular/core';
import { SearchQuery } from 'src/app/models/searchquery.model';
import { dbSvc } from 'src/app/services/dbSvc.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css'],
})
export class SearchListComponent implements OnInit {
  searches: SearchQuery[];

  constructor(private db: dbSvc) {}

  ngOnInit(): void {
    this.db.listSearch().then((res) => {
      this.searches = res;
    });
  }
}
