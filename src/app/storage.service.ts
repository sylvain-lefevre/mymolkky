import { Equipe } from './equipe';
import { Joueur } from './joueur';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Game } from "./game";


@Injectable()
export class StorageService {


  constructor(private http: Http) { }

  public setPlayersConfig(players: Array<Joueur> ): void {
    localStorage.setItem('players', JSON.stringify(players));
  }

  public getPlayersConfig(): Array<Joueur> {
    return JSON.parse(localStorage.getItem('players'));
  }

  public setTeamConfig(equipes: Array<Equipe> ): void {
    localStorage.setItem('teams', JSON.stringify(equipes));
  }

  public getTeamConfig(): Array<Equipe> {
     return JSON.parse(localStorage.getItem('teams'));
  }
  
  public setTeamAleatoire(param: string ): void {
      localStorage.setItem('teamsAlea', param);
    }

    public getTeamAleatoire(): string {
       return localStorage.getItem('teamsAlea');
    }
    
    public setNbAleatoire(param: string ): void {
        localStorage.setItem('nbAlea', param);
      }

      public getNbAleatoire(): string {
         return localStorage.getItem('nbAlea');
      }

  public setGameType(gameType: string): void {
    localStorage.setItem('gameType', gameType);
  }

  public getGameType(): string {
     return localStorage.getItem('gameType');
  }

  public resetStore(): void {
    localStorage.clear();
  }

  public setReglesConfig(regles: Array<string> ): void {
    localStorage.setItem('regles', JSON.stringify(regles));
  }

  public getReglesConfig(): Array<string> {
    return JSON.parse(localStorage.getItem('regles'));
  }
  
  public setGameConfig(game: Game ): void {
      localStorage.setItem('game', JSON.stringify(game));
    }

    public getGameConfig(): Game {
      return JSON.parse(localStorage.getItem('game'));
    }
}
