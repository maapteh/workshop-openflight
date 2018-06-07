import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from '@dest-app/components/search/search.component';
import { SpinnerComponent } from '@dest-app/components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SearchComponent,
    SpinnerComponent,
  ],
  exports: [
    SearchComponent,
    SpinnerComponent,
  ]
})
export class UiModule { }
