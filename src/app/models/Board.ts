import { Field } from "./Field";

export interface Board {
    id: number;
    playerId: number;
    x_Size: number;
    y_Size:number;
    rows: Row[];
}

export interface Row {
    fields: Field[];
}