import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/models.interface';
import { countryAPI } from 'src/app/services/country.service';
import { dbSvc } from 'src/app/services/db.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  countries: Country[];
  constructor(private countryAPI: countryAPI, private db: dbSvc) {}

  ngOnInit(): void {
    this.getCountries();
  }

  async getCountries() {
    //check database
    if (!(await this.db.haveCountries())) {
      //db empty, pull from api
      this.db.saveCountries(await this.countryAPI.getCountries());
    }
    this.countries = await this.db.getCountries();
  }
}
