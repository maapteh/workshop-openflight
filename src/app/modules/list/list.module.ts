import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from '@dest-app/modules/ui/ui.module';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list/list.component';
import { ListPriceComponent } from './list-price/list-price.component';
import { ListPriceSparklineComponent } from './list-price/list-price-sparkline/list-price-sparkline.component';

@NgModule({
  imports: [
    CommonModule,
    ListRoutingModule,
    UiModule,
  ],
  declarations: [
    ListComponent,
    ListPriceComponent,
    ListPriceSparklineComponent,
  ]
})
export class ListModule { }
