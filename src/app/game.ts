import { Equipe } from './equipe';
import { Joueur } from './joueur';
import { Tour } from './tour';
export class Game {
  tours: Array<Tour>;
  regles: Array<string>;
  gameType: string;
  equipes: Array<Equipe>;
  joueurs: Array<Joueur>;
  numTour = 1 ;
  joueurSuivant: Joueur;
  equipeSuivante: Equipe;
}
