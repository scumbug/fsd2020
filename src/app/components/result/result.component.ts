import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchQuery } from 'src/app/models/searchquery.model';
import { getJikan } from 'src/app/services/getJikan.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  query: SearchQuery = {
    q: this.actRoute.snapshot.params['q'],
    type: this.actRoute.snapshot.params['type'],
  };
  results: any[];

  constructor(private actRoute: ActivatedRoute, private jikan: getJikan) {}

  ngOnInit(): void {
    //do search
    this.jikan.searchAnime(this.query.q).then((res) => {
      //@ts-ignore
      this.results = res.results;
    });
  }
}
