import { Joueur } from './joueur';
import { Coup } from './coup';
import { Game } from './game';
import { StorageService } from './storage.service';
import { Tour } from './tour';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MdDialog, MdDialogRef, MdButton, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [StorageService]
})

export class GameComponent {

   score: number=null;
    annonce: number=null;
    gameover=false;
message: string;
    messageJoueur: string='';
  game = new Game;
 pointer=0;
 pointerPrecedent=0;
 nbEliminate=0;
 gagnant=[];
  constructor( private router: Router, private storageService: StorageService, public dialogAnnuleCoups: MdDialog, public dialogCoups: MdDialog, public dialogRestart: MdDialog) {
    
      if(storageService.getGameType()==='Individuel' && storageService.getTeamAleatoire()==='true' && this.storageService.getNbAleatoire()!=='1'){
          this.game.gameType = 'Equipe';
      }else{
          this.game.gameType = storageService.getGameType();
      }
      
    this.game.joueurs = storageService.getPlayersConfig();
    this.game.equipes = storageService.getTeamConfig();
    const regles = storageService.getReglesConfig();
    if ( regles ) {
      this.game.regles = [];
      if ( regles[0] === 'true' ) {
        this.game.regles.push('Elimination apres 3 zero');
      }
      if ( regles[1] === 'true' ) {
        this.game.regles.push('Annonce du score');
      }
    }
    const tour = new Tour;
    tour.num = 1;
    tour.joueurs=[];
    this.game.tours = [];
    this.game.tours.push( tour );
    if(this.game.gameType==='Equipe'){
        this.game.equipeSuivante = this.game.equipes[this.pointer];
        this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer];
    }else{
        this.game.joueurSuivant = this.game.joueurs[this.pointer];
    }
   }
  
  validateScore(e, el): void{
      if(this.game.gameType==='Individuel'){
          this.individuel(el);
      }else{
          this.equipe(el);
      }
      
  }
  
  openDialogCoups(): void {
      this.storageService.setGameConfig(this.game);
      let dialogRef = this.dialogCoups.open(DialogCoups, {data : this.game});
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }
  
  openDialogAnnuleCoups(): void {
      this.storageService.setGameConfig(this.game);
      let dialogRef = this.dialogAnnuleCoups.open(DialogAnnuleCoups, {data : this.game});
      dialogRef.afterClosed().subscribe(result => {
        if(result>=0){
            let tour = this.game.tours[this.game.tours.length-1];
            let diff=0;
            if(tour.joueurs.length>0){
                let coup = tour.joueurs[tour.joueurs.length-1];
                diff = coup.score - result;
                if(coup.equipe !==undefined){
                    coup.equipe.score -= diff;
                    coup.equipe.precedent.splice(coup.equipe.precedent.length-1, 1);
                    coup.equipe.precedent.push(result);
                }
                coup.score = result;
                coup.joueur.score -= diff;
                if(this.game.gameType==='Equipe' ){
                    const nb = coup.equipe.id +1;
                     if(coup.equipe.score>50){
                         coup.equipe.score = 25;
                         if(this.gagnant[this.gagnant.length-1]=== 'Equipe '+nb){
                             this.gagnant.splice(this.gagnant.length-1,1);
                         }
                     }else if (coup.equipe.score===50){
                         if(this.gagnant[this.gagnant.length-1]!== 'Equipe '+nb){
                             this.gagnant.push('Equipe '+nb);
                         }
                     }else{
                         if(this.gagnant[this.gagnant.length-1]=== 'Equipe '+nb){
                             this.gagnant.splice(this.gagnant.length-1,1);
                         }
                     }
                }else{
                    if(coup.joueur.score>50){
                        coup.joueur.score = 25;
                        if(this.gagnant[this.gagnant.length-1]=== coup.joueur.nom){
                            this.gagnant.splice(this.gagnant.length-1,1);
                        }
                    }else if (coup.joueur.score===50){
                        if(this.gagnant[this.gagnant.length-1]!== coup.joueur.nom){
                            this.gagnant.push( coup.joueur.nom);
                        }
                    }else{
                        if(this.gagnant[this.gagnant.length-1]=== coup.joueur.nom){
                            this.gagnant.splice(this.gagnant.length-1,1);
                        }
                    }
                }
                coup.joueur.precedent.splice(coup.joueur.precedent.length-1, 1);
                coup.joueur.precedent.push(result);
                tour.joueurs[tour.joueurs.length-1] = coup;
            }else{
                tour = this.game.tours[this.game.tours.length-2];
                let coup = tour.joueurs[tour.joueurs.length-1];
                diff = tour.joueurs[tour.joueurs.length-1].score - result;
                if(coup.equipe !==undefined){
                    coup.equipe.score -= diff;
                    coup.equipe.precedent.splice(coup.equipe.precedent.length-1, 1);
                    coup.equipe.precedent.push(result);
                }
                coup.score = result;
                coup.joueur.score -= diff;
                coup.joueur.precedent.splice(coup.joueur.precedent.length-1, 1);
                coup.joueur.precedent.push(result);
                tour.joueurs[tour.joueurs.length-1] = coup;
            }
            if(this.gameover){
                let restePossible = false;
                if(this.gagnant.length>0){
                    let i=this.pointerPrecedent;
                    while(i<=this.game.joueurs.length-1){
                            if(!this.game.joueurs[i].eliminate && this.game.joueurs[i].score>=38){
                                restePossible=true;
                                break;
                            }
                            i++;
                   }
                    if(restePossible){
                        this.gameover=false;
                    }
                }else{
                    this.gameover=false;
                }
                this.message='';
                if(this.game.gameType==='Equipe' ){
                    this.rechercheEquipe();
                }else{
                    this.rechercheJoueur();
                }
                
            }
            
        }
      });
    }
  
  openDialogRestart(): void {
      this.storageService.setGameConfig(this.game);
      let dialogRef = this.dialogRestart.open(DialogRestart);
      dialogRef.afterClosed().subscribe(result => {
          this.restart(result);
      });
    }
  
  equipe(el): void{
      if(this.score!==null){
          
          this.message='';
          this.messageJoueur='';
          const val =this.pointer;
          this.pointerPrecedent = val
          this.pointer++;
          if(this.game.equipeSuivante.pointer>=this.game.equipeSuivante.joueurs.length-1){
              this.game.equipeSuivante.pointer= 0;
          }else{
              this.game.equipeSuivante.pointer++;
          }
          
          if(this.game.regles.includes('Annonce du score')){
              if(this.annonce!==null){
                  if(this.score===this.annonce){
                      this.score = this.score *2;
                  }else{
                      if(this.annonce>=this.score){
                          this.score = this.score - this.annonce;
                      }else{
                          this.score = this.annonce - this.score;
                      }
                      
                  }
                  this.annonce=null;
              }
          }
          this.game.equipeSuivante.score = this.game.equipeSuivante.score + this.score;
          for(let joueur of this.game.equipeSuivante.joueurs){
              if(joueur.id===this.game.joueurSuivant.id){
                  joueur.score = joueur.score + this.score;
              }
          }
          const coup = new Coup;
          coup.equipe=this.game.equipeSuivante;
          coup.joueur=this.game.joueurSuivant;
          coup.score = this.score;
          this.game.tours[this.game.numTour-1].joueurs.push(coup);
          if(this.game.equipeSuivante.precedent.length===2){
              this.game.equipeSuivante.precedent.splice(0, 1);
          }
          this.game.equipeSuivante.precedent.push(''+this.score)
          if(this.game.equipeSuivante.score>50){
              this.game.equipeSuivante.score = 25;
              this.message =  `Dommage Equipe ${this.game.equipeSuivante.id+1} retour a 25.`
          }else if(this.game.equipeSuivante.score===50){
              const nb = this.game.equipeSuivante.id+1;
              this.gagnant.push("Equipe "+nb);
          }
          if(this.score===0 && this.game.equipeSuivante.score!==0){
              let noZero = false;
              let nbtour = 1;
              
              if(this.game.tours.length>=3){
                  const toursToShow = this.game.tours.slice(this.game.tours.length-3);
                  for(let tour of toursToShow){
                      if(!noZero && nbtour<=3){
                          for(let coup of tour.joueurs){
                              if(coup.equipe.id===this.game.equipeSuivante.id){
                                  if(coup.score!==0){
                                      noZero=true;
                                  }
                                  break;
                              }
                          }
                      }
                      nbtour++;
                  }
              }
              if(!noZero && nbtour===4){
                  if(this.storageService.getReglesConfig()[0]==='true'){
                      for(let joueur of this.game.equipeSuivante.joueurs){
                          joueur.eliminate=true;
                      }
                      this.game.equipeSuivante.eliminate =true;
                      this.message =  `Dommage Equipe ${this.game.equipeSuivante.id+1} est elimine`;
                      let nbElim =0;
                      let vainqueur='';
                      for(const equipe of this.game.equipes){
                          if(equipe.eliminate){
                              nbElim++;
                          }else{
                              vainqueur= `${equipe.id}`;
                          }
                      }
                      if(nbElim===this.game.equipes.length-1){
                          this.gameover=true;
                          this.message = `Bravo Equipe ${vainqueur} !!! Tu gagnes`
                      }
                  }else{
                      this.game.equipeSuivante.score=0;
                      this.message =  `Dommage Equipe ${this.game.equipeSuivante.id+1} retour a 0`;
                  }
                  
              }
          }
          let restePossible = false;
          if(this.gagnant.length>0){
              let i=this.pointer;
              while(i<=this.game.equipes.length-1){
                      if(!this.game.equipes[i].eliminate && this.game.equipes[i].score>=38){
                          restePossible=true;
                          break;
                      }
                      i++;
             }
          }
          if(!this.gameover && (this.gagnant.length===0 || restePossible)){
              if(this.pointer>=this.game.equipes.length){
                  this.pointer =0;
                  this.game.numTour++;
                  const tour = new Tour;
                  tour.num = this.game.numTour;
                  tour.joueurs=[];
                  this.game.tours.push(tour);
              }
              if(!this.game.equipes[this.pointer].eliminate){
                  this.game.equipeSuivante = this.game.equipes[this.pointer];
                  this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer]
              }else{
                  let find=false;
                  for(let i=this.pointer;i<=this.game.equipes.length-1;i++){
                      if(!this.game.equipes[i].eliminate){
                          this.game.equipeSuivante = this.game.equipes[i];
                          this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer]
                          find=true;
                          this.pointer=i;
                          break;
                          
                      }
                  }
                  if(!find){
                      for(let i=0;i<=this.pointer;i++){
                          if(!this.game.equipes[i].eliminate){
                              this.game.equipeSuivante = this.game.equipes[i];
                              this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer]
                              find=true;
                              this.pointer=i;
                              break;
                          }
                      }
                  }
              }
              this.score=null;
              if(this.game.equipeSuivante.score!==0 && this.game.equipeSuivante.precedent[0]==='0' && this.game.equipeSuivante.precedent[1]==='0'){
                  this.messageJoueur='Attention retour à 0 possible.' ;
              }
              el.focus();
          }else{
              if(!this.gameover){
                  this.message+= 'Bravo ' + this.gagnant.join(", ") + " !!!";
                  this.message+=" Vous gagnez"
              }
              this.gameover=true;
          }
      }
  }
  
  individuel(el): void{
      if(this.score!==null){
          this.message='';
          this.messageJoueur='';
          const val =this.pointer;
          this.pointerPrecedent = val
          this.pointer++;
          if(this.game.regles.includes('Annonce du score')){
              if(this.annonce!==null){
                  if(this.score===this.annonce){
                      this.score = this.score *2;
                  }else{
                      if(this.annonce>=this.score){
                          this.score = this.score - this.annonce;
                      }else{
                          this.score = this.annonce - this.score;
                      }
                      
                  }
                  this.annonce=null;
              }
          }
          this.game.joueurSuivant.score =  this.game.joueurSuivant.score + this.score;
          const coup = new Coup;
          coup.joueur=this.game.joueurSuivant;
          coup.score = this.score;
          this.game.tours[this.game.numTour-1].joueurs.push(coup);
          if(this.game.joueurSuivant.precedent.length===2){
              this.game.joueurSuivant.precedent.splice(0, 1);
          }
          this.game.joueurSuivant.precedent.push(''+this.score)
          if(this.game.joueurSuivant.score>50){
              this.game.joueurSuivant.score = 25;
              this.message =  `Dommage ${this.game.joueurSuivant.nom} retour a 25.`
          }else if(this.game.joueurSuivant.score===50){
              this.gagnant.push(this.game.joueurSuivant.nom);
          }
          if(this.score===0 && this.game.joueurSuivant.score!==0){
              let noZero = false;
              let nbtour = 1;
              
              if(this.game.tours.length>=3){
                  const toursToShow = this.game.tours.slice(this.game.tours.length-3);
                  for(let tour of toursToShow){
                      if(!noZero && nbtour<=3){
                          for(let coup of tour.joueurs){
                              if(coup.joueur.id===this.game.joueurSuivant.id){
                                  if(coup.score!==0){
                                      noZero=true;
                                  }
                                  break;
                              }
                          }
                      }
                      nbtour++;
                  }
              }
              if(!noZero && nbtour===4){
                  if(this.storageService.getReglesConfig()[0]==='true'){
                      this.game.joueurSuivant.eliminate=true;
                      this.message =  `Dommage ${this.game.joueurSuivant.nom} est elimine`;
                      let nbElim =0;
                      let vainqueur='';
                      for(const joueur of this.game.joueurs){
                          
                          if(joueur.eliminate){
                              nbElim++;
                          }else{
                              vainqueur= joueur.nom;
                          }
                      }
                      if(nbElim===this.game.joueurs.length-1){
                          this.gameover=true;
                          this.message = `Bravo ${vainqueur} !!! Tu gagnes`
                      }
                  }else{
                      this.game.joueurSuivant.score=0;
                      this.message =  `Dommage ${this.game.joueurSuivant.nom} retour a 0`;
                  }
                  
              }
          }
          let restePossible = false;
          if(this.gagnant.length>0){
              let i=this.pointer;
              while(i<=this.game.joueurs.length-1){
                      if(!this.game.joueurs[i].eliminate && this.game.joueurs[i].score>=38){
                          restePossible=true;
                          break;
                      }
                      i++;
             }
          }
          if(!this.gameover && (this.gagnant.length===0 || restePossible)){
              if(this.pointer>=this.game.joueurs.length){
                  this.pointer =0;
                  this.game.numTour++;
                  const tour = new Tour;
                  tour.num = this.game.numTour;
                  tour.joueurs=[];
                  this.game.tours.push(tour);
              }
              if(!this.game.joueurs[this.pointer].eliminate){
                  this.game.joueurSuivant = this.game.joueurs[this.pointer];
              }else{
                  let find=false;
                  for(let i=this.pointer;i<=this.game.joueurs.length-1;i++){
                      if(!this.game.joueurs[i].eliminate){
                          this.game.joueurSuivant = this.game.joueurs[i];
                          find=true;
                          this.pointer=i;
                          break;
                          
                      }
                  }
                  if(!find){
                      for(let i=0;i<=this.pointer;i++){
                          if(!this.game.joueurs[i].eliminate){
                              this.game.joueurSuivant = this.game.joueurs[i];
                              find=true;
                              this.pointer=i;
                              break;
                          }
                      }
                  }
              }
              this.score=null;
              if(this.game.joueurSuivant.score!==0 && this.game.joueurSuivant.precedent[0]==='0' && this.game.joueurSuivant.precedent[1]==='0'){
                  this.messageJoueur='Attention retour à 0 possible.' ;
              }
              el.focus();
          }else{
              if(!this.gameover){
                  this.message+= 'Bravo ' + this.gagnant.join(", ") + " !!!";
                  if(this.gagnant.length>1){
                      this.message+=" Vous gagnez"
                  }else{
                      this.message+=" Tu gagnes"
                  }
              }
              this.gameover=true;
          }
      }
  }
  
  restart(mode: any): void{
      this.message='';
      this.messageJoueur='';
      this.pointer=0;
      this.nbEliminate=0;
      this.score=null;
      this.annonce=null;
      this.gameover=false;
      this.gagnant=[];
      this.game.numTour=1;
      this.game.tours = [];
      if(this.storageService.getGameType()==='Individuel' && this.storageService.getTeamAleatoire()==='true' && this.storageService.getNbAleatoire()!=='1'){
          this.game.gameType = 'Equipe';
      }else{
          this.game.gameType = this.storageService.getGameType();
      }
      
      if(mode==='meme'){
          this.game.joueurs = this.game.joueurs
          this.game.equipes = this.game.equipes
      }else if (mode==='suivant'){
          const joueur = this.game.joueurs[0];
          this.game.joueurs.splice(0, 1);
          this.game.joueurs.push(joueur);
          const equipe = this.game.equipes[0];
          this.game.equipes.splice(0, 1);
          this.game.equipes.push(equipe);
          
      }else{
          const index = mode;
          let joueurs = [];
          for(let i=0; i<=index-1;i++){
              joueurs.push(this.game.joueurs[i]);
          }
          this.game.joueurs.splice(0, index);
          for(const joueur of joueurs){
              this.game.joueurs.push(joueur);
          }
          if(this.game.gameType==='Equipe'){
              let equipes = [];
              for(let i=0; i<=index-1;i++){
                  equipes.push(this.game.equipes[i]);
              }
              this.game.equipes.splice(0, index);
              for(const equipe of equipes){
                  this.game.equipes.push(equipe);
              }
          }
      }
      for(let equipe of this.game.equipes){
          equipe.pointer=0;
          equipe.score=0;
          equipe.precedent=[];
          for(let joueur of equipe.joueurs){
              joueur.score=0;
              joueur.precedent=[];
          }
      }
      for(let joueur of this.game.joueurs){
          joueur.score=0;
          joueur.precedent=[];
      }
      const regles = this.storageService.getReglesConfig();
      if ( regles ) {
        this.game.regles = [];
        if ( regles[0] === 'true' ) {
          this.game.regles.push('Elimination apres 3 zero');
        }
        if ( regles[1] === 'true' ) {
          this.game.regles.push('Annonce du score');
        }
      }
      const tour = new Tour;
      tour.num = 1;
      tour.joueurs=[];
      this.game.tours = [];
      this.game.tours.push( tour );
      if(this.game.gameType==='Equipe'){
          this.game.equipeSuivante = this.game.equipes[this.pointer];
          this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer];
      }else{
          this.game.joueurSuivant = this.game.joueurs[this.pointer];
      }
  }
  
  newGame(): void{
      this.router.navigate(['/lancement']);
  }
  
  rechercheJoueur(): void{
      if(this.pointer>=this.game.joueurs.length){
          this.pointer =0;
          this.game.numTour++;
          const tour = new Tour;
          tour.num = this.game.numTour;
          tour.joueurs=[];
          this.game.tours.push(tour);
      }
      if(!this.game.joueurs[this.pointer].eliminate){
          this.game.joueurSuivant = this.game.joueurs[this.pointer];
      }else{
          let find=false;
          for(let i=this.pointer;i<=this.game.joueurs.length-1;i++){
              if(!this.game.joueurs[i].eliminate){
                  this.game.joueurSuivant = this.game.joueurs[i];
                  find=true;
                  this.pointer=i;
                  break;
                  
              }
          }
          if(!find){
              for(let i=0;i<=this.pointer;i++){
                  if(!this.game.joueurs[i].eliminate){
                      this.game.joueurSuivant = this.game.joueurs[i];
                      find=true;
                      this.pointer=i;
                      break;
                  }
              }
          }
      }
      this.score=null;
      if(this.game.joueurSuivant.score!==0 && this.game.joueurSuivant.precedent[0]==='0' && this.game.joueurSuivant.precedent[1]==='0'){
          this.messageJoueur='Attention retour à 0 possible.' ;
      }
  }
  
  rechercheEquipe(): void{
      if(this.pointer>=this.game.equipes.length){
          this.pointer =0;
          this.game.numTour++;
          const tour = new Tour;
          tour.num = this.game.numTour;
          tour.joueurs=[];
          this.game.tours.push(tour);
      }
      if(!this.game.equipes[this.pointer].eliminate){
          this.game.equipeSuivante = this.game.equipes[this.pointer];
          this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer]
      }else{
          let find=false;
          for(let i=this.pointer;i<=this.game.equipes.length-1;i++){
              if(!this.game.equipes[i].eliminate){
                  this.game.equipeSuivante = this.game.equipes[i];
                  this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer]
                  find=true;
                  this.pointer=i;
                  break;
                  
              }
          }
          if(!find){
              for(let i=0;i<=this.pointer;i++){
                  if(!this.game.equipes[i].eliminate){
                      this.game.equipeSuivante = this.game.equipes[i];
                      this.game.joueurSuivant = this.game.equipeSuivante.joueurs[this.game.equipeSuivante.pointer]
                      find=true;
                      this.pointer=i;
                      break;
                  }
              }
          }
      }
      this.score=null;
      if(this.game.equipeSuivante.score!==0 && this.game.equipeSuivante.precedent[0]==='0' && this.game.equipeSuivante.precedent[1]==='0'){
          this.messageJoueur='Attention retour à 0 possible.' ;
      }
  }

}

@Component({
    selector: 'dialog-coups',
    templateUrl: 'dialog-coups.html',
    providers: [StorageService]
  })
  export class DialogCoups {
    
    game :Game;
    map = new Map();
    constructor(@Inject(MD_DIALOG_DATA) public data: Game, public dialogRef: MdDialogRef<DialogCoups>, private storageService: StorageService) {
        this.game = data;
        for(let tour of this.game.tours){
            for(let coup of tour.joueurs){
                let score =[];
                if(this.map.has(coup.joueur.nom)){
                    score = this.map.get(coup.joueur.nom);
                }
                score.push(coup.score);
                this.map.set(coup.joueur.nom, score);
            }
            
        }
    }
  }

@Component({
    selector: 'dialog-annule-coups',
    templateUrl: 'dialog-annule-coups.html',
    providers: [StorageService]
  })
  export class DialogAnnuleCoups {
    
    game :Game;
    score: number;
    constructor(@Inject(MD_DIALOG_DATA) public data: Game, public dialogRef: MdDialogRef<DialogCoups>, private storageService: StorageService) {
        this.game = data;
    }
    
    valider(): void{
        this.dialogRef.close(this.score);
    }
  }

@Component({
    selector: 'dialog-restart',
    templateUrl: 'dialog-restart.html',
    providers: [StorageService]
  })
  export class DialogRestart {
    
    game :Game;
    
    constructor(public dialogRef: MdDialogRef<DialogRestart>, private storageService: StorageService) {
        this.game = this.storageService.getGameConfig();
        
    }
    
    meme(): void{
        this.dialogRef.close('meme');
    }
    
    suivant(): void{
        this.dialogRef.close('suivant');
    }
  }
