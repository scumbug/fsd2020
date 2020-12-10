import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoDetailsComponent } from './component/todo-details/todo-details.component';
import { TodoComponent } from './component/todo/todo.component';

const routes: Routes = [
  { path: '', component: TodoComponent }, //home page
  { path: 'details', component: TodoDetailsComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }, //catchall redirect home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
