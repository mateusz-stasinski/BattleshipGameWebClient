import { Player } from "./Player";

export interface Game {
    id: number
    isEnded: boolean;
    winnerId: number;
    players: Player[];
}