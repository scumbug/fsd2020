import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './component/create/create.component';
import { EditComponent } from './component/edit/edit.component';
import { TodoComponent } from './component/todo/todo.component';

const routes: Routes = [
  { path: '', component: TodoComponent }, //home page
  { path: 'edit', component: EditComponent },
  { path: 'create', component: CreateComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }, //catchall redirect home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
