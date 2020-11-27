import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//routes
import { AppRoutingModule } from './app-routing.module';

//components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CountriesComponent } from './components/countries/countries.component';
import { ArticlesComponent } from './components/articles/articles.component';

//modules
import { PrimeNGModule } from './primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dbSvc } from './services/db.service';
import { countryAPI } from './services/country.service';
import { HttpClientModule } from '@angular/common/http';
import { newsAPI } from './services/news.services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
    CountriesComponent,
    ArticlesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNGModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [dbSvc, countryAPI, newsAPI],
  bootstrap: [AppComponent],
})
export class AppModule {}
