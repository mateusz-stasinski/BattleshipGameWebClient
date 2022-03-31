import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { StartNewGameRequest } from "../models/StartNewGameRequest";
import { Game } from "../models/Game";
import { ShootRequest } from "../models/ShootRequest";
import { ShootResponse } from "../models/ShootResponse";


@Injectable({
    providedIn: "root"
})

export class GameService {

    constructor(private http: HttpClient){}

    public ContinueGame(id: number): Observable<Game> {
        return this.http.get<Game>(`${environment.apiUrl}/BattleshipGame/${id}`);
    }

    public StartNewGame(request: StartNewGameRequest): Observable<Game> {
        return this.http.post<Game>(`${environment.apiUrl}/BattleshipGame`, request);
    }

    public Shoot(request: ShootRequest): Observable<ShootResponse> {
        return this.http.put<ShootResponse>(`${environment.apiUrl}/BattleshipGame`, request);
    }
}