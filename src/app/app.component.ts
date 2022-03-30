import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Board } from './models/Board';
import { Field } from './models/Field';
import { Game } from './models/Game';
import { StartNewGameRequest } from './models/StartNewGameRequest';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
      },
      (err) => {
        console.log(err);
      }
    ));
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