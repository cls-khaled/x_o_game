/********************
 * File : game.ts
 * Created : Fri Apr 11 2025
 * Modified : Sat Apr 12 2025
 * Author : Khaled Fathi
 * Email : dev@khaledfathi.com
 * 
 * logic for calculation the winner for X_O Game 
********************/

import { Marker, Winner } from "./types";

export function checkWinner(
    gameMatrixValue: Array<Array<string>>,
    currentGameSteps: Array<number>,
    playerMarker: Marker
): Winner {
    let arrayFactor = 0;  // used to calculate from 2D array to single deminsion array
    for (let i = 0; i < 3; i++) {
        if ( // row
            (gameMatrixValue[i][0] && gameMatrixValue[i][1] && gameMatrixValue[i][2]) &&
            (gameMatrixValue[i][0] == gameMatrixValue[i][1] && gameMatrixValue[i][0] == gameMatrixValue[i][2])
        ) {
            return {
                isGameEnd: true,
                playerMarker: playerMarker == Marker.X ? Marker.O : Marker.X,
                WinnerlinePositions: [arrayFactor, arrayFactor + 1, arrayFactor + 2]
            }
        } else if ( //column
            (gameMatrixValue[0][i] && gameMatrixValue[1][i] && gameMatrixValue[2][i]) &&
            (gameMatrixValue[0][i] == gameMatrixValue[1][i] && gameMatrixValue[0][i] == gameMatrixValue[2][i])
        ) {

            return {
                isGameEnd: true,
                playerMarker: playerMarker == Marker.X ? Marker.O : Marker.X,
                WinnerlinePositions: [i, i + 3, i + 6]
            }
        }
        arrayFactor += 3;
    }
    //diagonal
    if (
        (gameMatrixValue[0][0] && gameMatrixValue[1][1] && gameMatrixValue[2][2]) &&
        (gameMatrixValue[0][0] == gameMatrixValue[1][1] && gameMatrixValue[1][1] == gameMatrixValue[2][2])
    ) {
        return {
            isGameEnd: true,
            playerMarker: playerMarker == Marker.X ? Marker.O : Marker.X,
            WinnerlinePositions: [0, 1 + 3, 2 + 6]
        }
    } else if (
        (gameMatrixValue[0][2] && gameMatrixValue[1][1] && gameMatrixValue[2][0]) &&
        (gameMatrixValue[0][2] == gameMatrixValue[1][1] && gameMatrixValue[1][1] == gameMatrixValue[2][0])
    ) {
        return {
            isGameEnd: true,
            playerMarker: playerMarker == Marker.X ? Marker.O : Marker.X,
            WinnerlinePositions: [2, 1 + 3, 0 + 6]
        }
    }
    //draw
    if (currentGameSteps.length == 9) {
        return {
            isGameEnd: true,
            playerMarker: Marker.DRAW
        }
    }
    return { isGameEnd: false };
}