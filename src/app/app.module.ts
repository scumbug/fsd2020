import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { ResultComponent } from './components/result/result.component';
import { SearchComponent } from './components/search/search.component';

//additional modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material.module';
import { getJikan } from './services/getJikan.service';

//import lottie
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { dbSvc } from './services/dbSvc.service';

export function playerFactory() {
  return player;
}

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'searchlist', component: SearchListComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search/:type/:q', component: ResultComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SearchListComponent,
    ResultComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  providers: [getJikan, dbSvc],
  bootstrap: [AppComponent],
})
export class AppModule {}
