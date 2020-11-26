import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './component/form/form.component';
import { MainComponent } from './component/main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'form', component: FormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
