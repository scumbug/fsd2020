import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { HttpClientModule } from '@angular/common/http';
import { FetchService } from './fetch.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const ROUTES: Routes = [
  { path: '', component: RsvpComponent }, //home page
  { path: 'add', component: AddComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }, //catchall redirect home
];

@NgModule({
  declarations: [AppComponent, RsvpComponent, AddComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [FetchService],
  bootstrap: [AppComponent],
})
export class AppModule {}
