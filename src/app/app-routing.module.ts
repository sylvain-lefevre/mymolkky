import { GameComponent } from './game.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home.component';
import { LancementComponent } from './lancement.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'lancement', component: LancementComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'game', component: GameComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
