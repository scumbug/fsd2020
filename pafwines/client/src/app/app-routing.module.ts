import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountriesComponent } from './components/countries/countries.component';
import { WinesComponent } from './components/wines/wines.component';

const routes: Routes = [
  { path: '', component: CountriesComponent },
  { path: 'country/:country', component: WinesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
