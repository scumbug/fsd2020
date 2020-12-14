import { Component, OnInit } from '@angular/core';
import { WineServiceService } from 'src/app/wine-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  countries: any[];
  constructor(private db: WineServiceService) {}

  ngOnInit(): void {
    this.db.getCountries().then((res) => (this.countries = res));
  }
}
