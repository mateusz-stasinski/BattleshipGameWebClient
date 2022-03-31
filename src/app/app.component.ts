import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from './models/Game';
import { ShootRequest } from './models/ShootRequest';
import { ShootResponse } from './models/ShootResponse';
import { StartNewGameRequest } from './models/StartNewGameRequest';
import { GameService } from './services/game.service';
import { fade } from './shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fade]
})
export class AppComponent {
  
  isGameStarted: boolean = false;
  isNewGameChosen: boolean = false;
  isContinuationGameChosen: boolean = false;

  newGameForm = this.newGameFormBuilder.group({
    firstPlayerName: new FormControl('', Validators.required),
    secondPlayerName: new FormControl('', Validators.required),
    xSize: new FormControl(Validators.min(7), Validators.max(20)),
    ySize: new FormControl(Validators.min(7), Validators.max(20))
  });

  continueGameForm = this.continueGameFormBuilder.group({
    gameId: new FormControl(Validators.required)
  })

  subscriptions: Subscription[] = [];
  game!: Game;
  shootingPlayerName: string = '';
  shot!: ShootResponse;
  winnerName: string = '';

  constructor(
    private gameService: GameService,
    private newGameFormBuilder: FormBuilder,
    private continueGameFormBuilder: FormBuilder) {
  }

  InitializeGame(): void {
    const request: StartNewGameRequest = {
      firstPlayerName: this.getFormElementByName('firstPlayerName')?.value,
      secondPlayerName: this.getFormElementByName('secondPlayerName')?.value,
      xSize: this.getFormElementByName('xSize')?.value,
      ySize: this.getFormElementByName('ySize')?.value
    }
    console.log(request);

    let game$ = this.gameService.StartNewGame(request);
    this.subscriptions.push(game$.subscribe(
      (response) => {
        this.isGameStarted = true;
        this.game = response;
        console.log(response);
        this.shootingPlayerName = this.game.players.find(p => p.isMyOpponentMove == false)?.name ?? '';
        this.winnerName = this.game.players.find(p => p.isWinner == true)?.name ?? '';
      },
      (err) => {
        console.log(err);
      }
    ));
  }

  LoadGame(): void {
    const gameId: number = this.getFormElementByName('gameId')?.value;
    
    let game$ = this.gameService.ContinueGame(gameId);
    this.subscriptions.push(game$.subscribe(
      (response) => {
        this.isGameStarted = true;
        this.game = response;
        console.log(response);
        this.shootingPlayerName = this.game.players.find(p => p.isMyOpponentMove == false)?.name ?? '';
        this.winnerName = this.game.players.find(p => p.isWinner == true)?.name ?? '';
      },
      (err) => {
        console.log(err);
      }
    ));
  }

  Shoot(attackedPlayerId: number, yPosition: number, xPosition: number): void {

    const request: ShootRequest = {
      gameId: this.game.id,
      attackedPlayerId: attackedPlayerId,
      y_Position: yPosition,
      x_Position: xPosition,
    }
    console.log(request);

    let game$ = this.gameService.Shoot(request);
    this.subscriptions.push(game$.subscribe(
      (response) => {
        this.shot = response;

        if (!response.isHit){
          //Wyświetlić jakiś snackbar, że pudło
        } else {
          if (!response.isSunk) {
            //Wyświetlić jakiś snackbar, że trafiony ale nie zatopiony
          } else {
            if (!response.isGameOver) {
              //Wyświetlić jakiś snackbar, że trafiony i zatopiony
            } else {
              //Wyświetlić jakiś snackbar, że Koniec Gry!
            }
          }
        }
        console.log(response);
        this.UpdateGame(this.game.id);
      },
      (err) => {
        if(err.status == 409) {
          // Jakiś snackbar, że nie twoja kolej
        }
      }
    ));
  }

  UpdateGame(gameid: number): void {
    let game$ = this.gameService.ContinueGame(gameid);
    this.subscriptions.push(game$.subscribe(
      (response) => {
        this.isGameStarted = true;
        this.game = response;
        console.log(response);
        this.shootingPlayerName = this.game.players.find(p => p.isMyOpponentMove == false)?.name ?? '';
        this.winnerName = this.game.players.find(p => p.isWinner == true)?.name ?? '';
      },
      (err) => {
        console.log(err);
      }
    ))
  }

  StartNewGame(): void {
    this.isNewGameChosen = true;
  }

  ContinueGame(): void {
    this.isContinuationGameChosen = true;
  }

  getFormElementByName(name: string): AbstractControl {
    return this.newGameForm.get(name)! ?? this.continueGameForm.get(name)!;
  }
}