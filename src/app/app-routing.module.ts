import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroComponent } from './components/intro/intro.component';

export const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'map', loadChildren: './modules/maps/maps.module#MapsModule' },
  { path: 'list', loadChildren: './modules/list/list.module#ListModule' },
  { path: 'intro', component: IntroComponent },
  { path: '**', redirectTo: '/map' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
