import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './component/main/main.component';
import { FormComponent } from './component/form/form.component';
import { ResultComponent } from './component/result/result.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { PrimeNGModule } from './primeng.module';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [AppComponent, MainComponent, FormComponent, ResultComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LottieModule.forRoot({ player: playerFactory }),
    PrimeNGModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
