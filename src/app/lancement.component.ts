import { AppComponent } from './app.component';
import { Equipe } from './equipe';
import { Joueur } from './joueur';
import { StorageService } from './storage.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lancement',
  templateUrl: './lancement.component.html',
  styleUrls: ['./lancement.component.css'],
  providers: [StorageService]
})

export class LancementComponent {

  typeEquipe: string;
  toto: string;
    aleatoire = false;
    nbJoueur: number;

  equipes: Array<Equipe>= [];

  joueurs: Array<Joueur>= [];

   etats: Array<boolean>[];

  choix = [
    'Equipe',
    'Individuel'
  ];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private storageService: StorageService, private router: Router) {
    iconRegistry.addSvgIcon(
        'delete',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/delete.svg'));
    iconRegistry.addSvgIcon(
        'flecheHaut',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/flecheHaut.svg'));
    iconRegistry.addSvgIcon(
        'flecheBas',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/flecheBas.svg'));

    const joueursStore = this.storageService.getPlayersConfig();
    if ( joueursStore) {
      this.joueurs = joueursStore.slice();
      const equipesStore = this.storageService.getTeamConfig();
      if ( equipesStore ) {
        const equipes = equipesStore.slice();
        for ( const equipe of equipes){
         const newEquipe = new Equipe;
         newEquipe.id = equipe.id;
         for ( const playeur of equipe.joueurs){
           for ( const existant of this.joueurs){
             if ( playeur.id === existant.id) {
               newEquipe.joueurs.push(existant);
             }
           }
         }
         this.equipes.push(newEquipe);
        }
      }
    }else {
      const joueur1 = new Joueur;
      joueur1.id = 0;
      joueur1.nom = 'joueur1';
      this.joueurs.push(joueur1);
      const joueur2 = new Joueur;
      joueur2.id = 1;
      joueur2.nom = 'joueur2';
      this.joueurs.push(joueur2);

      const equipe1 = new Equipe;
      equipe1.joueurs.push(joueur1);
      equipe1.id = 0;
      this.equipes.push(equipe1);

      const equipe2 = new Equipe;
      equipe2.joueurs.push(joueur2);
      equipe2.id = 1;
      this.equipes.push(equipe2);
    }

    const gameType = this.storageService.getGameType();
    if ( gameType) {
      this.typeEquipe = gameType;
      if(gameType==='Individuel'){
          this.aleatoire = (this.storageService.getTeamAleatoire()==='true');
          
          if(this.aleatoire){
              this.nbJoueur= +this.storageService.getNbAleatoire();
          }
      }
    }else {
      this.typeEquipe = 'Equipe';
    }

    this.etats=[];
  }

  ajouterJoueur(): void {
    const joueur = new Joueur;
    if (this.joueurs.length > 0 ) {
      joueur.id = this.joueurs[this.joueurs.length - 1].id + 1;
    }else {
      joueur.id = 0;
    }
    const nb = joueur.id+1
    joueur.nom = 'joueur'+nb;
   this.joueurs.push(joueur);

    if ( this.equipes.length > 0 ) {
      const modulo = (this.joueurs.length - 1) % this.equipes.length;
      this.equipes[modulo].joueurs.push(joueur);
    }
  }

  ajouterJoueurEquipe(index): void {
    const joueur = new Joueur;
    if (this.joueurs.length > 0 ) {
      joueur.id = this.joueurs[this.joueurs.length - 1].id + 1;
    }else {
      joueur.id = 0;
    }
    const nb = joueur.id+1;
    joueur.nom = 'joueur'+nb;
   this.joueurs.push(joueur);

    const equipe = this.equipes[index];
    equipe.joueurs.push(joueur);
  }

  ajouterEquipe(): void {
    const joueur = new Joueur;
    if (this.joueurs.length > 0 ) {
      joueur.id = this.joueurs[this.joueurs.length - 1].id + 1;
    }else {
      joueur.id = 0;
    }
    const nb = joueur.id+1
    joueur.nom = 'joueur'+nb;
    this.joueurs.push(joueur);

    const equipe = new Equipe;
    if (this.equipes.length > 0 ) {
      equipe.id = this.equipes[this.equipes.length - 1].id + 1;
    }else {
      equipe.id = 0;
    }
    equipe.joueurs.push(joueur);
    this.equipes.push(equipe);
  }

  enleverJoueur(index: number): void {
   const joueurASupprimer = this.joueurs[index];
   let indexEquipe = 0 ;
   for ( const equipe of this.equipes ) {
     let trouve = false;
     let indexASupp = 0;
     for ( const joueur of equipe.joueurs){
       if ( joueur.id === joueurASupprimer.id) {
         equipe.joueurs.splice(indexASupp, 1);
         trouve = true;
         if (equipe.joueurs.length < 1) {
           this.equipes.splice(indexEquipe, 1);
         }
         break;
       }
       indexASupp++;
     }
     if (trouve) {
       break;
     }
     indexEquipe++;
   }
   this.joueurs.splice(index, 1);
  }

  enleverJoueurEquipe(index: number, joueur: number): void {
   const joueurASupprimer = this.equipes[index].joueurs[joueur];
    let indexASupp = 0;
   for ( const item of this.joueurs){
     if ( item.id === joueurASupprimer.id) {
       this.joueurs.splice(indexASupp, 1);
       break;
     }
     indexASupp++;
   }
   this.equipes[index].joueurs.splice(joueur, 1);
   if (this.equipes[index].joueurs.length < 1) {
     this.equipes.splice(index, 1);
   }
  }


  enleverEquipe(index: number): void {
   this.equipes.splice(index, 1);
  }

  trackByJoueur(index: number, joueur: Joueur): number { return joueur.id; }

  trackByEquipe(index: number, equipe: Equipe): number { return equipe.id; }

  toSettings(): void {
      this.storageService.setPlayersConfig(this.joueurs);
      if(this.typeEquipe==='Individuel' && this.aleatoire && this.nbJoueur>1){
          this.equipes = [];
          let nb =0;
          
          for(let i =1; i<=this.nbJoueur;i++){
              if(i<=this.joueurs.length){
                  const equipe = new Equipe;
                  equipe.id = i-1;
                  this.equipes.push(equipe);
              }
          }
          let liste = this.joueurs.slice();
          while(liste.length>0){
              let index =Math.floor(Math.random() * (liste.length - 0 + 1)) + 0;
              let joueur = liste[index];
              let index2 = nb%this.equipes.length;
              if(typeof joueur!='undefined'){
                  this.equipes[index2].joueurs.push(joueur);
                  liste.splice(index,1);
                  nb++;
              }
              
          }
      }
    
    this.storageService.setTeamConfig(this.equipes);
    this.storageService.setGameType(this.typeEquipe);
    this.storageService.setTeamAleatoire(`${this.aleatoire}`);
    this.storageService.setNbAleatoire(`${this.nbJoueur}`);
    
    this.router.navigate(['/settings']);
  }
  
  onSubmit(): void{
      this.router.navigate(['/settings']);
  }
}
