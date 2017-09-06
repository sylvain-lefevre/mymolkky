import { StorageService } from './storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [StorageService]
})

export class SettingsComponent {

  elimination = false;
  annonce = false;

  constructor( private router: Router, private storageService: StorageService) {
    const regles = storageService.getReglesConfig();
    if ( regles ) {
      this.elimination = (regles[0] === 'true');
      if ( this.elimination === undefined ) {
        this.elimination = false;
      }
      this.annonce = (regles[1] === 'true');
      if ( this.annonce === undefined ) {
        this.annonce = false;
      }
    }
  }

  goBack(): void {
    this.sauvegardeRegles();
    this.router.navigate(['/lancement']);
  }

  launchGame(): void {
    this.sauvegardeRegles();
    this.router.navigate(['/game']);
  }

  private sauvegardeRegles(): void {
    const regles = [this.elimination.toString(), this.annonce.toString()];
    this.storageService.setReglesConfig(regles);
  }
}
