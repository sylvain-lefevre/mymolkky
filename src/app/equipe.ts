import { Joueur } from './joueur';
export class Equipe {
  id: number;
  joueurs: Array<Joueur>= [];
score: number = 0;
eliminate: boolean = false;
pointer: number = 0;
precedent: Array<string>=[];
}
