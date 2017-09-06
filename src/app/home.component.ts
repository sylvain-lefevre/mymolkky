import { StorageService } from './storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [StorageService]
})

export class HomeComponent {
  constructor( private router: Router, private storageService: StorageService) { }

  lancerPartie(): void {
    this.storageService.resetStore();
    this.router.navigate(['/lancement']);
  }
}
