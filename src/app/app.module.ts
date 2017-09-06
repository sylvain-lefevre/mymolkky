import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MdButtonModule, MdRadioModule, MdInputModule, MdIconModule, MdCheckboxModule, MdDialogModule} from '@angular/material';

import { AppComponent } from './app.component';
import { Equipe } from './equipe';
import { GameComponent, DialogRestart, DialogCoups, DialogAnnuleCoups } from './game.component';
import { HomeComponent } from './home.component';
import { Joueur } from './joueur';
import { LancementComponent } from './lancement.component';
import { SettingsComponent } from './settings.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LancementComponent,
    SettingsComponent,
    GameComponent,
    DialogRestart,
    DialogCoups,
    DialogAnnuleCoups
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdRadioModule,
    MdInputModule,
    MdIconModule,
    MdCheckboxModule,
    MdDialogModule,
    NgbModule.forRoot()
  ],
  entryComponents: [
    DialogRestart,
    DialogCoups,
    DialogAnnuleCoups
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
