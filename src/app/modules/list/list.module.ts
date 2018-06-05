import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from '@dest-app/modules/ui/ui.module';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    ListRoutingModule,
    UiModule,
  ],
  declarations: [
    ListComponent,
  ]
})
export class ListModule { }
