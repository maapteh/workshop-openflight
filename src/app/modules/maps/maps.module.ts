import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from '@dest-app/modules/ui/ui.module';

import { MapsRoutingModule } from './maps-routing.module';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [
    CommonModule,
    MapsRoutingModule,
    UiModule,
  ],
  declarations: [
    MapComponent,
  ]
})
export class MapsModule { }
