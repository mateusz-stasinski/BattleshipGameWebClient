import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Field } from './models/Field';
import { Game } from './models/Game';
import { ShootRequest } from './models/ShootRequest';
import { ShootResponse } from './models/ShootResponse';
import { StartNewGameRequest } from './models/StartNewGameRequest';
import { GameService } from './services/game.service';
import { fade, fadeLong } from './shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fade, fadeLong]
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
    private continueGameFormBuilder: FormBuilder,
    private snackBar: MatSnackBar) {
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
        let message = err.title ?? err.message;
        this.snackBar.open(message, "Close");
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
        if (err.status == 404) {
          this.snackBar.open('There is no game with the given number ', "Close");
        } else {
          let message = err.title ?? err.message;
          this.snackBar.open(message, "Close");
        }
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

        let updateField: Field = {
          x_Position: request.x_Position,
          y_Position: request.y_Position,
          status: this.shot.status,
          shipId: this.shot.shipId,
          boardId: this.shot.boardId
        }
        let playerIndex = this.game.players.findIndex(p => p.id == attackedPlayerId);
        this.game.players[playerIndex].board.rows[request.y_Position - 1].fields[request.x_Position -1] = updateField;
        console.log(response);
        setTimeout(() => {
          this.UpdateGame(this.game.id);
        },2000);
      },
      (err) => {
        if(err.status == 409) {
          this.snackBar.open('This is not your turn', 'Close');
        } else {
          let message = err.title ?? err.message;
          this.snackBar.open(message, "Close");
        }
        console.log(err);
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
        let message = err.title ?? err.message;
        this.snackBar.open(message, "Close");
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