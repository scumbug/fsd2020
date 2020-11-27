import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';

const PRIMENG = [
  InputTextModule,
  ButtonModule,
  DataViewModule,
  CardModule,
  AccordionModule,
  PanelModule,
];

@NgModule({
  imports: PRIMENG,
  exports: PRIMENG,
})
export class PrimeNGModule {}
