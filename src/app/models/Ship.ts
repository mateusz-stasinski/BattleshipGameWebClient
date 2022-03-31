import { Field } from "./Field";

export interface Ship {
    id: number;
    name: string;
    length: number;
    fields: Field[];
    isSunk: boolean;
    playerId: number;
}