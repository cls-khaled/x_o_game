/********************
 * File : main.ts
 * Created : Fri Apr 11 2025
 * Modified : Sat Apr 12 2025
 * Author : Khaled Fathi
 * Email : dev@khaledfathi.com
 * 
 * 
********************/
import { Marker, RoundRecord, Winner } from "./types";
import { checkWinner } from "./game";

const
    // ** Constants > style class name  ** 
    X_COLOR = 'x-color',
    O_COLOR = 'o-color',
    HIDE_HISTORY_SCREEN = 'hide',
    WINNING_STEPS_BACKGROUND = 'winning-steps-bg',
    // ** UI Elements **
    gameObserver: HTMLElement = document.querySelector('#game-observer')!,
    nextPlayerMarker: HTMLElement = document.querySelector('#next-player-marker')!,
    newGameBtn: HTMLElement = document.querySelector('#new-game-btn')!,
    clearHistoryBtn: HTMLElement = document.querySelector('#clear-history-btn')!,
    historyList: HTMLElement = document.querySelector('#history-list')!,
    gameCells: HTMLCollection = document.querySelector('#game-board')!.children,
    scoreWinCounterO: HTMLElement = document.querySelector('#win-counter-o')!,
    scoreWinCounterX: HTMLElement = document.querySelector('#win-counter-x')!,
    scoreCounterDraw: HTMLElement = document.querySelector('#draw-counter')!,
    //
    historyScreen: HTMLElement = document.querySelector('#history-screen')!,
    historyScreenCloseBtn: HTMLElement = document.querySelector('#history-screen-btn')!,
    historyGameBoardCells: HTMLCollection = document.querySelector('#history-game-board')!.children;

var
    // ** Game Variables **
    winnerObj: Winner = { isGameEnd: false },
    startMarker: Marker = Marker.X,
    playerMarker: Marker = startMarker,
    gameMatrixValue: Array<Array<string>> = Array.from({ length: 3 }, () => new Array(3).fill('')),
    // ** for saving game history **
    isAddedToHistory = false,
    winCounterX = 0,
    winCounterO = 0,
    drawCounter = 0,
    roundCounter = 0,
    gameHistory: Array<RoundRecord> = [],
    currentGameSteps: Array<number> = [],
    timeouts: Array<number> = [];


// **  EVENTS ** 
for (let i = 0; i < gameCells.length; i++) {
    let cell = gameCells[i] as HTMLElement;
    cell.addEventListener('click', () => { handleCellClick(cell, i) });
}
newGameBtn.addEventListener('click', handleNewGameBtnClick);
clearHistoryBtn.addEventListener('click', handleClearHistoryBtnClick);
historyScreenCloseBtn.addEventListener('click', handleScreenCloseBtnClick);
// **  ------------- ** 

// **  EVENT HANDLER FUNCTIONS  ** 
function handleCellClick(cell: HTMLElement, index: number): void {
    // convert index from single deminsion to two deminsion
    let coordinates = convertIndexToMatrixCoordinate(index);
    // set 'X' or 'O' on a cell , and save it's value in game position array 
    if (!winnerObj.isGameEnd && cell.innerHTML == '') {
        cell.innerHTML = playerMarker;
        gameMatrixValue[coordinates.row][coordinates.col] = playerMarker;
        playerMarker == Marker.X ? cell.classList.add(X_COLOR) : cell.classList.add(O_COLOR);
        togglePlayerMarker();
        // save  step for history
        currentGameSteps.push(index);
    }
    //check winner
    winnerObj = checkWinner(gameMatrixValue, currentGameSteps, playerMarker);
    // after game end 
    if (winnerObj.isGameEnd) {
        if (winnerObj.playerMarker != Marker.DRAW) {
            gameObserver.innerHTML = `Winner is ${winnerObj.playerMarker!}`;
            gameObserver.classList.add(winnerObj.playerMarker! == Marker.X ? X_COLOR : O_COLOR );
            winnerObj.playerMarker == Marker.X ? winCounterX++ : winCounterO++;
            setStyleForWinnerSteps(winnerObj.WinnerlinePositions!);
        } else {
            gameObserver.innerHTML = `No Winner  (${winnerObj.playerMarker!})`;
            drawCounter++;
        }
        // add round record to game history
        let roundRecord = { startMarker: startMarker, stepsPosition: currentGameSteps, winner: winnerObj }
        gameHistory.push(roundRecord);
        if (!isAddedToHistory) {
            addRoundToHistoryList(roundRecord);
        }
    }
}

function handleNewGameBtnClick(): void {
    winnerObj = { isGameEnd: false };
    isAddedToHistory = false;
    playerMarker = startMarker;
    gameMatrixValue = Array.from({ length: 3 }, () => new Array(3).fill(''));
    currentGameSteps = [];
    nextPlayerMarker.innerHTML = playerMarker;
    nextPlayerMarker.className =''; 
    nextPlayerMarker.classList.add(playerMarker! == Marker.X ? X_COLOR : O_COLOR );
    gameObserver.innerHTML = "";
    for (let i = 0; i < gameCells.length; i++) {
        gameCells[i].classList.remove(WINNING_STEPS_BACKGROUND);
        gameCells[i].classList.remove(X_COLOR);
        gameCells[i].classList.remove(O_COLOR);
        gameCells[i].innerHTML = '';

    }

}

function handleScreenCloseBtnClick(): void {
    console.log("dsa");
    historyScreen.classList.add(HIDE_HISTORY_SCREEN);
    // clear data and style for history display board
    for (let i = 0; i < historyGameBoardCells.length; i++) {
        historyGameBoardCells[i].innerHTML = "";
        historyGameBoardCells[i].classList.remove(X_COLOR);
        historyGameBoardCells[i].classList.remove(O_COLOR);
        historyGameBoardCells[i].classList.remove(WINNING_STEPS_BACKGROUND);
    }
    timeouts.forEach((timeout) => clearTimeout(timeout));
    timeouts = [];
}

function handleHistoryDisplayRound(roundRecord: RoundRecord): void {
    // show screen for displaying history round
    historyScreen.classList.remove(HIDE_HISTORY_SCREEN);
    // 
    let nextMarker = roundRecord.startMarker;

    let delay = 500;
    roundRecord.stepsPosition.forEach((posistion) => {
        let timeout = setTimeout(() => {
            let cell = historyGameBoardCells[posistion]
            cell.innerHTML = nextMarker;
            if (nextMarker == Marker.X) {
                cell.classList.add(X_COLOR);
            } else {
                cell.classList.add(O_COLOR);
            }
            nextMarker = nextMarker == Marker.X ? Marker.O : Marker.X;
        }, delay);
        delay += 500;
        timeouts.push(timeout);
    });

    let timeout = setTimeout(() => {
        // style for winning line  X X X or O O O 
        roundRecord.winner.WinnerlinePositions?.forEach((position) => {
            if (roundRecord.winner.playerMarker != Marker.DRAW)
                historyGameBoardCells[position].classList.add(WINNING_STEPS_BACKGROUND);
        });
    }, roundRecord.stepsPosition.length * 500);
    timeouts.push(timeout);
}

function handleClearHistoryBtnClick(): void {
    roundCounter = 0;
    gameHistory = [];
    winCounterX = winCounterO = drawCounter = 0;
    scoreWinCounterO.innerHTML = '0';
    scoreWinCounterX.innerHTML = '0';
    scoreCounterDraw.innerHTML = '0';
    historyList.innerHTML = "";
}
// **  ------------- ** 

// **  CORE FUNCTIONS ** 
function togglePlayerMarker(): void {
    if (playerMarker == Marker.X){
        playerMarker = Marker.O ;
        nextPlayerMarker.classList.remove(X_COLOR);
        nextPlayerMarker.classList.add(O_COLOR);
    } else{
        playerMarker = Marker.X ;
        nextPlayerMarker.classList.remove(O_COLOR);
        nextPlayerMarker.classList.add(X_COLOR);
    }
    nextPlayerMarker.innerHTML = playerMarker;
}

function addRoundToHistoryList(roundRecord: RoundRecord): void {
    roundCounter++;
    isAddedToHistory = true;
    let div = document.createElement('div');
    if (roundRecord.winner.playerMarker != Marker.DRAW) {
        div.innerHTML = `${roundCounter}- Winner is ${roundRecord.winner.playerMarker}`;
        scoreWinCounterX.innerHTML = winCounterX.toString();
        scoreWinCounterO.innerHTML = winCounterO.toString();
    } else {
        div.innerHTML = `${roundCounter}- No Winner - ${roundRecord.winner.playerMarker}`;
        scoreCounterDraw.innerHTML = drawCounter.toString();
    }
    historyList.appendChild(div);
    // event
    div.addEventListener('click', () => handleHistoryDisplayRound(roundRecord));
}

function setStyleForWinnerSteps(winningCells: Array<number>): void {
    winningCells.forEach(cellIndex => {
        gameCells[cellIndex].classList.add(WINNING_STEPS_BACKGROUND);
    });
}
// **  ------------- ** 

// **  HELPER FUNCTIONS ** 
function convertIndexToMatrixCoordinate(index: number): { row: number, col: number } {
    let row = 0;
    let col = index;
    for (; col > 2; row++) {
        col = col - 3;
    }
    return { row, col };
}
// **  ------------- ** 