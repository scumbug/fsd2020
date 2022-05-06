import { NgModule } from '@angular/core';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { Trash, HouseFill } from 'ngx-bootstrap-icons';

const ICONS = {
  Trash,
  HouseFill,
};

@NgModule({
  declarations: [],
  imports: [NgxBootstrapIconsModule.pick(ICONS)],
  exports: [NgxBootstrapIconsModule],
})
export class IconsModule {}
