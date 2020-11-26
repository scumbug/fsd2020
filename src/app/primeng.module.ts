import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
const PRIMENG = [InputTextModule, ButtonModule];

@NgModule({
  imports: PRIMENG,
  exports: PRIMENG,
})
export class PrimeNGModule {}
