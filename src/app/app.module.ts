import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main.component';
import { CreateComponent } from './create.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoDatabase } from './todo.database';
import { TodoDetailComponent } from './todo-detail.component';

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'create', component: CreateComponent },
  { path: 'todo/:todoId', component: TodoDetailComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CreateComponent,
    TodoComponent,
    TodoDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [TodoDatabase],
  bootstrap: [AppComponent],
})
export class AppModule {}
