import { Board } from "./Board";
import { Ship } from "./Ship";

export interface Player {
    id: number;
    name: string;
    score: number;
    isWinner: boolean;
    isYourMove: boolean;
    board: Board;
    ships: Ship[];
}