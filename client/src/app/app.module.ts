import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TodoComponent } from './component/todo/todo.component';
import { FormComponent } from './component/form/form.component';
import { EditComponent } from './component/edit/edit.component';
import { CreateComponent } from './component/create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from './icons.module';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    FormComponent,
    EditComponent,
    CreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
