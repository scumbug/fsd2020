import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WineServiceService } from 'src/app/wine-service.service';

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrls: ['./wines.component.css'],
})
export class WinesComponent implements OnInit {
  wines: any[];
  constructor(
    private actRoute: ActivatedRoute,
    private db: WineServiceService
  ) {}

  ngOnInit(): void {
    this.db
      .getWines(this.actRoute.snapshot.params.country)
      .then((res) => (this.wines = res));
  }
}
